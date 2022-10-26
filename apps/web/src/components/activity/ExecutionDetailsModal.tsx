import { LoadingOverlay, Modal, useMantineColorScheme } from '@mantine/core';
import { useQuery } from 'react-query';

import { ExecutionDetailsAccordion } from './ExecutionDetailsAccordion';
import { ExecutionDetailsFooter } from './ExecutionDetailsFooter';

import { getNotification } from '../../api/activity';
import { colors, shadows, Title } from '../../design-system';

export function ExecutionDetailsModal({
  notificationId,
  modalVisibility,
  origin,
  onClose,
}: {
  notificationId: string;
  modalVisibility: boolean;
  onClose: () => void;
  origin: string;
}) {
  const theme = useMantineColorScheme();
  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery(['activity', notificationId], () => getNotification(notificationId), {
    enabled: !!notificationId,
  });

  const { jobs } = response?.data || {};

  return (
    <Modal
      opened={modalVisibility}
      overlayColor={theme.colorScheme === 'dark' ? colors.BGDark : colors.BGLight}
      overlayOpacity={0.7}
      styles={{
        modal: {
          backgroundColor: theme.colorScheme === 'dark' ? colors.B15 : colors.white,
          width: '60%',
        },
        body: {
          paddingTop: '5px',
        },
        inner: {
          paddingTop: '180px',
        },
      }}
      title={<Title size={2}>Execution details</Title>}
      sx={{ backdropFilter: 'blur(10px)' }}
      shadow={theme.colorScheme === 'dark' ? shadows.dark : shadows.medium}
      radius="md"
      size="lg"
      onClose={onClose}
    >
      <LoadingOverlay
        visible={isLoading || isFetching}
        overlayColor={theme.colorScheme === 'dark' ? colors.B30 : colors.B98}
        loaderProps={{
          color: colors.error,
        }}
        data-test-id="execution-details-modal-loading-overlay"
      />
      <ExecutionDetailsAccordion steps={jobs} />
      <ExecutionDetailsFooter onClose={onClose} origin={origin} />
    </Modal>
  );
}
