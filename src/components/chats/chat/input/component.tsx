import { useMutation } from '@apollo/client';
import { AttachFileOutlined, SendOutlined } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CREATE_MESSAGE } from '../../../../core/api';
import * as types from '../../../../core/types';
import { useUpload } from '../../../../hooks/use-upload';
import { useAppSelector } from '../../../../redux';
import { selectChat } from '../../../../redux/features/chat';
import { Attachment } from './attachment';

interface Variables {
  text?: string;
  buttons?: types.Button[];
  files?: any[];
}

export const ChatInput: React.FC = React.memo(() => {
  const { t } = useTranslation();

  const chat = useAppSelector(selectChat);

  const { control, ...form } = useForm<Variables>({
    defaultValues: {
      text: undefined,
      buttons: undefined,
      files: undefined,
    },
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'files',
  });

  const files = useWatch({
    control,
    name: 'files',
  });

  const [createMessage, { loading }] = useMutation(CREATE_MESSAGE);
  const upload = useUpload();

  const handleSubmit: SubmitHandler<Variables> = async ({ files, ...variables }) => {
    try {
      const attachments =
        files.length === 0
          ? undefined
          : await toast.promise(
              Promise.all(
                files.map(async (file) => ({
                  type:
                    file.type.startsWith('image/') && file.size <= 5242880
                      ? types.AttachmentType.Image
                      : types.AttachmentType.Document,
                  url: await upload(file),
                  name: file.name,
                })),
              ),
              t<any, any>('common:promise', { returnObjects: true }),
            );

      await toast.promise(
        createMessage({
          variables: {
            channelId: chat.channelId,
            accountId: chat.accountId,
            ...variables,
            attachments,
          },
        }),
        t<any, any>('common:promise', { returnObjects: true }),
      );

      form.reset();
    } catch {}
  };

  return (
    <Box>
      {files?.length > 0 && (
        <Box display='flex' pt={1} pr={1}>
          {files.map((file, i) => (
            <Attachment key={i} file={file} onRemove={() => remove(i)} />
          ))}
        </Box>
      )}
      <Box
        component='form'
        display='flex'
        alignItems='center'
        p={1}
        onSubmit={form.handleSubmit(handleSubmit)}>
        <IconButton component='label' disabled={loading}>
          <input
            hidden
            type='file'
            multiple
            onChange={(event) => {
              const length = files?.length ?? 0;
              append(Array.from(event.target.files).slice(0, 10 - length));
            }}
          />
          <AttachFileOutlined />
        </IconButton>
        <TextField
          variant='standard'
          fullWidth
          multiline
          placeholder={t('chats:chat.input')}
          maxRows={8}
          disabled={loading}
          {...form.register('text')}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton type='submit' disabled={loading}>
                  <SendOutlined />
                </IconButton>
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
        />
      </Box>
    </Box>
  );
});
