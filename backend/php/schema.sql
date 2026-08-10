-- =====================================================================
-- TTshop Pro landing — database schema
-- MySQL 5.7+ / MariaDB 10.3+  (utf8mb4)
-- Import once:  mysql -u ttshopmuser -p ttshopmuser < schema.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- LEADS — every landing-page signup
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `leads_id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `leads_uuid`           CHAR(36)        NOT NULL,
  `leads_name`           VARCHAR(120)    NOT NULL,           -- nom
  `leads_first_name`     VARCHAR(120)        NULL,           -- prénom (optionnel)
  `leads_phone`          VARCHAR(20)     NOT NULL,
  `leads_phone2`         VARCHAR(20)         NULL,
  `leads_email`          VARCHAR(190)        NULL,
  `leads_cin`            VARCHAR(20)         NULL,
  `leads_governorate`    VARCHAR(80)         NULL,
  `leads_delegation`     VARCHAR(80)         NULL,
  `leads_address`        VARCHAR(255)        NULL,
  `leads_postal_code`    VARCHAR(10)         NULL,
  `leads_need`           VARCHAR(120)        NULL,           -- besoin choisi
  `leads_offer`          VARCHAR(120)        NULL,           -- offre visée
  `leads_message`        TEXT                NULL,
  `leads_lang`           VARCHAR(5)      NOT NULL DEFAULT 'fr',
  `leads_existing_client` TINYINT(1)     NOT NULL DEFAULT 0,
  `leads_status`         ENUM('new','contacted','qualified','won','lost','duplicate')
                                         NOT NULL DEFAULT 'new',
  `leads_assigned_to`    VARCHAR(120)        NULL,
  `leads_comment`        TEXT                NULL,
  -- attribution
  `leads_source`         VARCHAR(80)     NOT NULL DEFAULT 'landing',
  `leads_utm_source`     VARCHAR(120)        NULL,
  `leads_utm_medium`     VARCHAR(120)        NULL,
  `leads_utm_campaign`   VARCHAR(160)        NULL,
  `leads_utm_content`    VARCHAR(160)        NULL,
  `leads_utm_term`       VARCHAR(160)        NULL,
  `leads_gclid`          VARCHAR(190)        NULL,
  `leads_fbclid`         VARCHAR(190)        NULL,
  `leads_referrer`       VARCHAR(500)        NULL,
  `leads_landing_page`   VARCHAR(500)        NULL,
  `leads_form_id`        VARCHAR(80)         NULL,           -- hero / modal / final-cta
  -- technique
  `leads_visitor_id`     CHAR(36)            NULL,           -- lien vers visitors.visitors_visitor_id
  `leads_ip`             VARCHAR(45)         NULL,
  `leads_country`        CHAR(2)             NULL,
  `leads_region`         VARCHAR(100)        NULL,
  `leads_city`           VARCHAR(100)        NULL,
  `leads_user_agent`     VARCHAR(500)        NULL,
  `leads_device`         VARCHAR(20)         NULL,
  `leads_created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leads_updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`leads_id`),
  UNIQUE KEY `uk_leads_uuid` (`leads_uuid`),
  KEY `idx_leads_phone` (`leads_phone`),
  KEY `idx_leads_cin` (`leads_cin`),
  KEY `idx_leads_status` (`leads_status`),
  KEY `idx_leads_created` (`leads_created_at`),
  KEY `idx_leads_gov` (`leads_governorate`),
  KEY `idx_leads_visitor` (`leads_visitor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- VISITORS — one row per page view (IP, geo, page, temps passé)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `visitors` (
  `visitors_id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `visitors_visitor_id`    CHAR(36)        NOT NULL,        -- cookie/localStorage id
  `visitors_session_id`    CHAR(36)            NULL,
  `visitors_ip`            VARCHAR(45)         NULL,
  `visitors_country`       CHAR(2)             NULL,
  `visitors_country_name`  VARCHAR(100)        NULL,
  `visitors_region`        VARCHAR(100)        NULL,
  `visitors_city`          VARCHAR(100)        NULL,
  `visitors_latitude`      DECIMAL(10,6)       NULL,
  `visitors_longitude`     DECIMAL(10,6)       NULL,
  `visitors_isp`           VARCHAR(150)        NULL,
  `visitors_page`          VARCHAR(500)        NULL,        -- path visité
  `visitors_page_title`    VARCHAR(255)        NULL,
  `visitors_referrer`      VARCHAR(500)        NULL,
  `visitors_utm_source`    VARCHAR(120)        NULL,
  `visitors_utm_medium`    VARCHAR(120)        NULL,
  `visitors_utm_campaign`  VARCHAR(160)        NULL,
  `visitors_utm_content`   VARCHAR(160)        NULL,
  `visitors_utm_term`      VARCHAR(160)        NULL,
  `visitors_gclid`         VARCHAR(190)        NULL,
  `visitors_fbclid`        VARCHAR(190)        NULL,
  `visitors_lang`          VARCHAR(10)         NULL,
  `visitors_user_agent`    VARCHAR(500)        NULL,
  `visitors_device`        VARCHAR(20)         NULL,
  `visitors_browser`       VARCHAR(40)         NULL,
  `visitors_os`            VARCHAR(40)         NULL,
  `visitors_screen`        VARCHAR(20)         NULL,        -- 1920x1080
  `visitors_timezone`      VARCHAR(60)         NULL,
  `visitors_time_on_page`  INT UNSIGNED    NOT NULL DEFAULT 0,  -- secondes
  `visitors_scroll_depth`  TINYINT UNSIGNED NOT NULL DEFAULT 0, -- %
  `visitors_is_lead`       TINYINT(1)      NOT NULL DEFAULT 0,
  `visitors_entered_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visitors_last_seen_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`visitors_id`),
  KEY `idx_visitors_visitor` (`visitors_visitor_id`),
  KEY `idx_visitors_session` (`visitors_session_id`),
  KEY `idx_visitors_ip` (`visitors_ip`),
  KEY `idx_visitors_country` (`visitors_country`),
  KEY `idx_visitors_entered` (`visitors_entered_at`),
  KEY `idx_visitors_page` (`visitors_page`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;