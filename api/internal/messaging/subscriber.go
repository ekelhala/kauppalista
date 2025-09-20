package messaging

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type Subscriber struct {
	redisClient *redis.Client
	ctx         context.Context
}

func NewSubscriber(redisClient *redis.Client, ctx context.Context) *Subscriber {
	return &Subscriber{redisClient: redisClient, ctx: ctx}
}

func (s *Subscriber) Subscribe(channel string) *redis.PubSub {
	return s.redisClient.Subscribe(s.ctx, channel)
}

func (s *Subscriber) Unsubscribe(pubsub *redis.PubSub, channel string) error {
	return pubsub.Unsubscribe(s.ctx, channel)
}
