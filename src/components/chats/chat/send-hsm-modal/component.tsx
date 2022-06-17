import { useMutation, useQuery } from '@apollo/client';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CREATE_MESSAGE, HSM } from '../../../../core/api';
import { Chat, Hsm } from '../../../../core/types';

interface SendHsmModalProps extends DialogProps {
  chat: Pick<Chat, 'id' | 'contact'>;
  onSubmit?: () => void;
  onCancel?: () => void;
}

interface Variables {
  hsm: Hsm;
  variables: Record<string, string>;
}

const filterOptions = createFilterOptions({
  stringify: (option: any) => option.code.concat(option.text),
});

export const SendHsmModal: React.FC<SendHsmModalProps> = ({
  chat,
  onSubmit,
  onCancel,
  ...props
}) => {
  const { t } = useTranslation();

  const hsm = useQuery(HSM);

  const { control, ...form } = useForm<Variables>({
    defaultValues: {
      variables: {},
    },
  });

  const selected = useWatch({
    control,
    name: 'hsm',
  });

  const variables = useWatch({
    control,
    name: 'variables',
  });

  const [createMessage] = useMutation(CREATE_MESSAGE);

  const handleSubmit = (variables: Variables) => {
    toast
      .promise(
        createMessage({
          variables: {
            chatId: chat.id,
            text: Object.entries(variables.variables).reduce(
              (text, [key, val]) => text.replace(key, val ?? key),
              variables.hsm.text,
            ),
            buttons: variables.hsm.buttons,
          },
        }),
        t<any, any>('common:promise', { returnObjects: true }),
      )
      .then(() => onSubmit?.())
      .catch(() => null);
  };

  return (
    <Dialog {...props} maxWidth='md' fullWidth>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogTitle>{t<string>('chats:chat.sendHsmModal.title', chat.contact)}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t<string>('chats:chat.sendHsmModal.description')}</DialogContentText>
          <Autocomplete
            isOptionEqualToValue={(option, value) => option.code === value.code}
            autoHighlight
            filterOptions={filterOptions}
            renderInput={(params) => <TextField {...params} />}
            options={hsm.data?.hsm ?? []}
            renderOption={(props, option) => (
              <Box
                component='li'
                sx={{
                  padding: 1,
                }}
                {...props}>
                <Typography
                  component='span'
                  sx={{
                    mr: 1,
                    padding: 0.5,
                    bgcolor: '#dcf8c6',
                    borderRadius: 1,
                  }}>
                  {option.code}
                </Typography>
                {option.text}
              </Box>
            )}
            getOptionLabel={(option: Hsm) => option.code}
            onChange={(_, option: Hsm) => {
              form.setValue('hsm', option);
              if (option) {
                form.setValue(
                  'variables',
                  Object.fromEntries(option.text.match(/{{[0-9]+}}/g).map((key) => [key, ''])),
                );
              }
            }}
          />
          {selected && (
            <Paper
              sx={{
                mt: 2,
                padding: 1,
              }}>
              <Box
                display='flex'
                flexDirection='column'
                alignItems='flex-end'
                padding={2}
                bgcolor='#f0f1f3'
                borderRadius={1}>
                <Box
                  maxWidth='80%'
                  bgcolor='#3d5afe'
                  color='#ffffff'
                  borderRadius={2}
                  sx={{
                    borderBottomRightRadius: 0,
                  }}>
                  <Typography
                    padding={0.5}
                    sx={{
                      wordBreak: 'break-all',
                    }}>
                    {Object.entries(variables).reduce(
                      (text, [key, val]) => text.replace(key, val || key),
                      selected.text,
                    )}
                  </Typography>
                </Box>
                <Box display='flex' flexDirection='column' alignItems='flex-end' mt={0.5}>
                  {selected.buttons?.map((button, index) => (
                    <Chip
                      key={index}
                      variant='outlined'
                      sx={{
                        mb: 0.5,
                        ':last-child': {
                          mb: 0,
                        },
                      }}
                      label={button.text}
                    />
                  ))}
                </Box>
              </Box>
              <Box>
                {Object.entries(variables).map(([key]) => (
                  <TextField
                    key={key}
                    fullWidth
                    variant='standard'
                    label={key}
                    margin='dense'
                    {...form.register(`variables.${key}`)}
                  />
                ))}
              </Box>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={onCancel}>
            {t<string>('chats:chat.sendHsmModal.cancel')}
          </Button>
          <Button variant='outlined' type='submit'>
            {t<string>('chats:chat.sendHsmModal.submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
