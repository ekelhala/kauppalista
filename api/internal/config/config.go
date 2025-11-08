package config

import (
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server struct {
		Port int    `yaml:"port" validate:"required"`
		Host string `yaml:"host" validate:"required"`
	} `yaml:"server"`
	Redis struct {
		Host string `yaml:"host" validate:"required"`
		Port int    `yaml:"port" validate:"required"`
	} `yaml:"redis"`
	Keycloak struct {
		Issuer   string `yaml:"issuer"`
		ClientID string `yaml:"client_id"`
		Realm    string `yaml:"realm"`
	} `yaml:"keycloak"`
}

func LoadConfig(configPath string) *Config {
	var config Config
	data, err := os.ReadFile(configPath)
	if err != nil {
		log.Fatalf("failed to read config file: %v", err)
	}
	if err := yaml.Unmarshal(data, &config); err != nil {
		log.Fatalf("failed to unmarshal config: %v", err)
	}
	if config.Server.Port == 0 || config.Server.Host == "" {
		log.Fatalf("invalid server configuration: port and host must be set")
		return nil
	}
	return &config
}
