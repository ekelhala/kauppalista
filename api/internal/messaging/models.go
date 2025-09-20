package messaging

type PubSubMessage struct {
	Type int16 `json:"type"`
	Data any   `json:"data"`
}
