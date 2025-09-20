package messaging

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type Publisher struct {
	redisClient *redis.Client
	ctx         context.Context
}

func NewPublisher(redisClient *redis.Client, ctx context.Context) *Publisher {
	return &Publisher{redisClient: redisClient, ctx: ctx}
}

func (p *Publisher) Publish(channel string, message PubSubMessage) error {
	return p.redisClient.Publish(p.ctx, channel, message).Err()
}
