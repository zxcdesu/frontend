import { AssignmentOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { NodeProps, Position } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { HandleBase, NodeBase } from '../../fragments';

interface TransferData {
  assignedTo: number | null;
}

export const Transfer: React.FC<NodeProps<TransferData>> = React.memo(({ id, data }) => {
  const { t } = useTranslation();

  const color = '#3d5afe';

  return (
    <>
      <HandleBase type='target' position={Position.Left} nodeId={id} />
      <NodeBase color={color}>
        <Box display='flex' alignItems='center'>
          <AssignmentOutlined
            sx={{
              mr: 1,
              padding: 0.5,
              bgcolor: `${color}2f`,
              color,
              fontSize: 30,
              borderRadius: 2,
            }}
          />
          <Typography>{t<string>('chatbots:editor.nodes.Transfer.title')}</Typography>
        </Box>
      </NodeBase>
    </>
  );
});
