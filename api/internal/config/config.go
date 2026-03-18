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
	Auth0 struct {
		Issuer             string `yaml:"issuer"`
		APIAudience        string `yaml:"api_audience"`
		ManagementAudience string `yaml:"management_audience"`
		ManagementClientID string `yaml:"management_client_id"`
	} `yaml:"auth0"`
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
	if config.Auth0.Issuer == "" || config.Auth0.APIAudience == "" {
		log.Fatalf("invalid auth0 configuration: issuer and api_audience must be set")
		return nil
	}
	if config.Auth0.ManagementAudience == "" || config.Auth0.ManagementClientID == "" {
		log.Fatalf("invalid auth0 configuration: management_audience and management_client_id must be set")
		return nil
	}
	return &config
}
