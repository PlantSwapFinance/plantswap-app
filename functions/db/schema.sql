-- PlantSwap Neon PostgreSQL Schema
-- Run this in your Neon SQL Editor to create the database schema

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users ((data->>'email'));
CREATE INDEX IF NOT EXISTS idx_users_userId ON users ((data->>'userId'));
CREATE INDEX IF NOT EXISTS idx_users_username ON users ((data->>'username'));
CREATE INDEX IF NOT EXISTS idx_users_telephone ON users ((data->>'telephone'));

-- Users Types
CREATE TABLE IF NOT EXISTS users_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_types_users_type_id ON users_types ((data->>'usersTypeId'));

-- Users Setting
CREATE TABLE IF NOT EXISTS users_setting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_setting_user_id ON users_setting ((data->>'userId'));

-- Users Access
CREATE TABLE IF NOT EXISTS users_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_access_user_id ON users_access ((data->>'userId'));
CREATE INDEX IF NOT EXISTS idx_users_access_user_type_code ON users_access ((data->>'userTypeCode'));

-- Usernames
CREATE TABLE IF NOT EXISTS usernames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_usernames_username ON usernames ((data->>'username'));
CREATE INDEX IF NOT EXISTS idx_usernames_user_id ON usernames ((data->>'userId'));

-- Pages
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pages_page_id ON pages ((data->>'pageId'));

-- Pages Access
CREATE TABLE IF NOT EXISTS pages_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pages_access_page_id ON pages_access ((data->>'pageId'));

-- Collectibles Farms
CREATE TABLE IF NOT EXISTS collectibles_farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_collectibles_farms_cfid ON collectibles_farms ((data->>'cfId'));

-- Collectibles Farms Bags
CREATE TABLE IF NOT EXISTS collectibles_farms_bags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_collectibles_farms_bags_cfid ON collectibles_farms_bags ((data->>'cfId'));
CREATE INDEX IF NOT EXISTS idx_collectibles_farms_bags_token_id ON collectibles_farms_bags ((data->>'tokenId'));
CREATE INDEX IF NOT EXISTS idx_collectibles_farms_bags_address ON collectibles_farms_bags ((data->>'address'));

-- Collectibles Farms Logs
CREATE TABLE IF NOT EXISTS collectibles_farms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_collectibles_farms_logs_cfid ON collectibles_farms_logs ((data->>'cfId'));
CREATE INDEX IF NOT EXISTS idx_collectibles_farms_logs_address ON collectibles_farms_logs ((data->>'address'));
CREATE INDEX IF NOT EXISTS idx_collectibles_farms_logs_cfid_address ON collectibles_farms_logs ((data->>'cfId'), (data->>'address'));

-- Unchained Datas
CREATE TABLE IF NOT EXISTS unchained_datas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_unchained_datas_data_type ON unchained_datas ((data->>'dataType'));

-- Unchained Log Datas
CREATE TABLE IF NOT EXISTS unchained_log_datas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_unchained_log_datas_data_type ON unchained_log_datas ((data->>'dataType'));

-- Visitors
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_visitors_address ON visitors ((data->>'address'));
