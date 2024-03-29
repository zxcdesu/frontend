import { Container } from '@mui/material';
import React from 'react';
import { WorkInProgress } from '../../components/common';
import { Layout } from '../../components/layout';
import { projectGuard, useGuard } from '../../hooks/use-guard';
import { NextPageWithLayout } from '../_app';

const IntegrationsPage: NextPageWithLayout = () => {
  const GuardWrapper = useGuard(projectGuard);

  return (
    <GuardWrapper>
      <Container
        maxWidth='lg'
        sx={{
          height: '100%',
          overflow: 'auto',
        }}>
        <WorkInProgress />
        {/* <Box display='flex' justifyContent='flex-end' mt={1} mb={1}>
          <Button variant='outlined'>{t<string>('integrations:create')}</Button>
        </Box>
        <Box>content here...</Box> */}
      </Container>
    </GuardWrapper>
  );
};

IntegrationsPage.getLayout = (page) => <Layout i18n='common:pages.integrations'>{page}</Layout>;

export default IntegrationsPage;
