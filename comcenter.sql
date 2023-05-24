CREATE TABLE IF NOT EXISTS `w_gauge_status_log` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `riverine` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'arg;wlms',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'gauge name',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'up;down;intermittent',
  `remarks` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `uid` int(11) NOT NULL COMMENT 'the user who add the status',
  `last_data` datetime NOT NULL COMMENT 'datetime of last data of the gauge',
  `dt_created` datetime NOT NULL,
  PRIMARY KEY (`gid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `w_infocast` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `num` varchar(20) NOT NULL,
  `net_ops` varchar(10) NOT NULL COMMENT 'network operator for the number',
  `address` varchar(200) NOT NULL,
  `affiliated` varchar(20) NOT NULL COMMENT 'contact''s affiliation.',
  `uid` int(11) NOT NULL COMMENT 'user id of the staff who added the contact',
  `dt_created` datetime NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='table for infocast contacts';