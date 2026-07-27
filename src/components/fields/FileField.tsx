'use client';

import { upload } from '@vercel/blob/client';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import { emptyFileAnswer, isFileAnswer, type FileAnswer, type UploadedFile } from '@/types/briefing';
import type { FieldProps } from './types';

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPT = 'image/*,application/pdf';

interface PendingUpload {
  id: string;
  name: string;
  percentage: number;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

export function FileField({ question, value, onChange, invalid, describedBy }: FieldProps) {
  const answer: FileAnswer = isFileAnswer(value) ? value : emptyFileAnswer();

  const [uploadsEnabled, setUploadsEnabled] = useState<boolean | null>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sem BLOB_READ_WRITE_TOKEN o campo funciona apenas com link.
  useEffect(() => {
    let active = true;
    fetch('/api/upload')
      .then((response) => response.json())
      .then((data: { enabled?: boolean }) => {
        if (active) setUploadsEnabled(Boolean(data.enabled));
      })
      .catch(() => {
        if (active) setUploadsEnabled(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback(
    (next: Partial<FileAnswer>) => onChange({ ...answer, ...next }),
    [answer, onChange],
  );

  // Uploads sequenciais não podem depender do estado capturado neste render:
  // o link pode ser digitado enquanto os arquivos ainda estão subindo.
  const latest = useRef(answer);
  useEffect(() => {
    latest.current = answer;
  }, [answer]);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length) return;
      setError(null);

      const room = MAX_FILES - answer.files.length;
      if (room <= 0) {
        setError(`Você já enviou o máximo de ${MAX_FILES} arquivos.`);
        return;
      }

      const chosen = Array.from(fileList).slice(0, room);
      const tooLarge = chosen.find((file) => file.size > MAX_FILE_BYTES);
      if (tooLarge) {
        setError(`"${tooLarge.name}" passa de 10 MB. Reduza o arquivo e tente novamente.`);
        return;
      }

      const accumulated = [...answer.files];

      for (const file of chosen) {
        const id = `${file.name}-${Date.now()}-${Math.random()}`;
        setPending((current) => [...current, { id, name: file.name, percentage: 0 }]);

        try {
          const blob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
            onUploadProgress: ({ percentage }) => {
              setPending((current) =>
                current.map((item) => (item.id === id ? { ...item, percentage } : item)),
              );
            },
          });

          const uploaded: UploadedFile = {
            url: blob.url,
            name: file.name,
            size: file.size,
            contentType: file.type,
          };

          accumulated.push(uploaded);
          onChange({ ...latest.current, files: [...accumulated] });
        } catch {
          setError(`Não foi possível enviar "${file.name}". Tente novamente ou use o campo de link.`);
        } finally {
          setPending((current) => current.filter((item) => item.id !== id));
        }
      }
    },
    [answer.files, onChange],
  );

  const removeFile = (url: string) => {
    update({ files: answer.files.filter((file) => file.url !== url) });
  };

  const showDropzone = uploadsEnabled !== false;

  return (
    <div className="space-y-5">
      {showDropzone ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            'rounded-xl border border-dashed p-8 text-center transition-colors duration-300',
            dragging ? 'border-paper bg-paper/[0.04]' : 'border-line',
            invalid && 'border-danger',
          )}
        >
          <input
            ref={inputRef}
            id={question.id}
            type="file"
            multiple
            accept={ACCEPT}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className="sr-only"
            onChange={(event) => {
              void handleFiles(event.target.files);
              event.target.value = '';
            }}
          />

          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="mx-auto h-7 w-7 text-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 15v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
          </svg>

          <p className="mt-4 text-sm text-muted">
            Arraste os arquivos até aqui ou{' '}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-paper underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              escolha do seu dispositivo
            </button>
          </p>
          <p className="mt-1.5 text-xs text-faint">
            Imagens ou PDF, até 10 MB cada, no máximo {MAX_FILES} arquivos.
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-line p-5 text-sm text-muted">
          O envio de arquivos não está ativo neste ambiente. Use o campo de link abaixo para
          compartilhar suas referências.
        </p>
      )}

      {/* Arquivos enviados e em andamento */}
      {(answer.files.length > 0 || pending.length > 0) && (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {answer.files.map((file) => (
              <motion.li
                key={file.url}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 rounded-lg border border-line bg-ink-raised px-4 py-3"
              >
                <span aria-hidden className="text-xs text-faint">
                  {file.contentType.startsWith('image/') ? 'IMG' : 'PDF'}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-paper">{file.name}</span>
                <span className="shrink-0 text-xs text-faint">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.url)}
                  className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-faint transition-colors hover:text-danger"
                >
                  <span aria-hidden className="text-xl leading-none">
                    ×
                  </span>
                  <span className="sr-only">Remover {file.name}</span>
                </button>
              </motion.li>
            ))}

            {pending.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-line px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3 text-sm text-muted">
                  <span className="min-w-0 truncate">{item.name}</span>
                  <span className="shrink-0 tabular-nums text-xs">{Math.round(item.percentage)}%</span>
                </div>
                <div className="mt-2 h-px w-full bg-line">
                  <div
                    className="h-px bg-bronze transition-[width] duration-200"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div>
        <label htmlFor={`${question.id}-link`} className="type-eyebrow text-faint">
          Ou cole um link
        </label>
        <input
          id={`${question.id}-link`}
          type="url"
          inputMode="url"
          placeholder="Pinterest, Google Drive, WeTransfer, Instagram…"
          value={answer.link}
          onChange={(event) => update({ link: event.target.value })}
          className="mt-2 w-full border-0 border-b border-line bg-transparent pb-2.5 text-base outline-none transition-colors duration-300 placeholder:text-faint focus:border-paper"
        />
      </div>
    </div>
  );
}
