import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageEntity, MessageRepository, SubscriberRepository, SubscriberEntity } from '@novu/dal';
import { GetMessagesCommand } from './get-messages.command';
import { KeyGenerator } from '../../../shared/services/cache/keys';
import { CachedEntity } from '../../../shared/interceptors/cached-entity.interceptor';

@Injectable()
export class GetMessages {
  constructor(private messageRepository: MessageRepository, private subscriberRepository: SubscriberRepository) {}

  async execute(command: GetMessagesCommand) {
    const LIMIT = command.limit;

    if (LIMIT > 1000) {
      throw new BadRequestException('Limit can not be larger then 1000');
    }

    const query: Partial<MessageEntity> & { _environmentId: string } = {
      _environmentId: command.environmentId,
      _organizationId: command.organizationId,
    };

    if (command.subscriberId) {
      const subscriber = await this.fetchSubscriber({
        _environmentId: command.environmentId,
        subscriberId: command.subscriberId,
      });

      if (subscriber) {
        query._subscriberId = subscriber._id;
      }
    }

    if (command.channel) {
      query.channel = command.channel;
    }

    const totalCount = await this.messageRepository.count(query);

    const data = await this.messageRepository.find(query, '', {
      limit: LIMIT,
      skip: command.page * LIMIT,
    });

    return {
      page: command.page,
      totalCount,
      pageSize: LIMIT,
      data,
    };
  }

  @CachedEntity({
    builder: KeyGenerator.subscriber,
  })
  private async fetchSubscriber({
    subscriberId,
    _environmentId,
  }: {
    subscriberId: string;
    _environmentId: string;
  }): Promise<SubscriberEntity | null> {
    return await this.subscriberRepository.findBySubscriberId(_environmentId, subscriberId);
  }
}
