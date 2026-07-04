package config

import (
	"log"
	"os"
	"strconv"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server struct {
		Port int    `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"server"`
	Redis struct {
		Host string `yaml:"host"`
		Port int    `yaml:"port"`
	} `yaml:"redis"`
	Auth0 struct {
		Issuer             string `yaml:"issuer"`
		APIAudience        string `yaml:"api_audience"`
		ManagementAudience string `yaml:"management_audience"`
		ManagementClientID string `yaml:"management_client_id"`
	} `yaml:"auth0"`
}

// LoadConfig loads configuration from a YAML file (if present) and then applies
// environment variable overrides. This allows the service to run with only env
// vars (e.g. in Dokploy) when no config file is mounted.
func LoadConfig(configPath string) *Config {
	var config Config

	if configPath != "" {
		if data, err := os.ReadFile(configPath); err == nil {
			if err := yaml.Unmarshal(data, &config); err != nil {
				log.Fatalf("failed to unmarshal config: %v", err)
			}
		} else if !os.IsNotExist(err) {
			log.Fatalf("failed to read config file: %v", err)
		}
	}

	applyEnvOverrides(&config)
	applyDefaults(&config)
	validate(&config)

	return &config
}

func applyEnvOverrides(c *Config) {
	if v := os.Getenv("SERVER_HOST"); v != "" {
		c.Server.Host = v
	}
	if v := os.Getenv("SERVER_PORT"); v != "" {
		if p, err := strconv.Atoi(v); err == nil {
			c.Server.Port = p
		}
	}
	if v := os.Getenv("REDIS_HOST"); v != "" {
		c.Redis.Host = v
	}
	if v := os.Getenv("REDIS_PORT"); v != "" {
		if p, err := strconv.Atoi(v); err == nil {
			c.Redis.Port = p
		}
	}
	if v := os.Getenv("AUTH0_ISSUER"); v != "" {
		c.Auth0.Issuer = v
	}
	if v := os.Getenv("AUTH0_API_AUDIENCE"); v != "" {
		c.Auth0.APIAudience = v
	}
	if v := os.Getenv("AUTH0_MANAGEMENT_AUDIENCE"); v != "" {
		c.Auth0.ManagementAudience = v
	}
	if v := os.Getenv("AUTH0_MANAGEMENT_CLIENT_ID"); v != "" {
		c.Auth0.ManagementClientID = v
	}
}

func applyDefaults(c *Config) {
	if c.Server.Host == "" {
		c.Server.Host = "0.0.0.0"
	}
	if c.Server.Port == 0 {
		c.Server.Port = 9000
	}
	if c.Redis.Host == "" {
		c.Redis.Host = "localhost"
	}
	if c.Redis.Port == 0 {
		c.Redis.Port = 6379
	}
}

func validate(c *Config) {
	if c.Auth0.Issuer == "" || c.Auth0.APIAudience == "" {
		log.Fatalf("invalid auth0 configuration: AUTH0_ISSUER and AUTH0_API_AUDIENCE must be set")
	}
	if c.Auth0.ManagementAudience == "" || c.Auth0.ManagementClientID == "" {
		log.Fatalf("invalid auth0 configuration: AUTH0_MANAGEMENT_AUDIENCE and AUTH0_MANAGEMENT_CLIENT_ID must be set")
	}
}
