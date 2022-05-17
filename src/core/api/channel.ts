import { gql, TypedDocumentNode } from '@apollo/client';
import { Channel, ChannelType } from '../types';

interface CreateChannelResult {
  createChannel: Channel;
}

interface CreateChannelVariables {
  name: string;
  type: ChannelType;
  accountId?: string;
  token: string;
}

export const CREATE_CHANNEL: TypedDocumentNode<CreateChannelResult, CreateChannelVariables> = gql`
  mutation CreateChannel($name: String!, $type: ChannelType!, $accountId: String, $token: String!) {
    createChannel(name: $name, type: $type, accountId: $accountId, token: $token) {
      id
      name
      status
      type
    }
  }
`;

interface ChannelsResult {
  channels: Channel[];
}

export const CHANNELS: TypedDocumentNode<ChannelsResult> = gql`
  query Channels {
    channels {
      id
      name
      status
      type
    }
  }
`;

interface ChannelByIdResult {
  channelById: Channel;
}

interface ChannelByIdVariables {
  id: Channel[];
}

export const CHANNEL_BY_ID: TypedDocumentNode<ChannelByIdResult, ChannelByIdVariables> = gql`
  query ChannelById($id: Int!) {
    channelById(id: $id) {
      id
      name
      status
      type
    }
  }
`;

interface UpdateChannelResult {
  createChannel: Channel;
}

interface UpdateChannelVariables {
  id: number;
  name: string;
}

export const UPDATE_CHANNEL: TypedDocumentNode<UpdateChannelResult, UpdateChannelVariables> = gql`
  mutation UpdateChannel($id: Int!, $name: String!) {
    updateChannel(id: $id, name: $name) {
      id
      name
      status
      type
    }
  }
`;
