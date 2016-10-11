CREATE TABLE `advpermissions` (
  `UserID` int(10) unsigned NOT NULL,
  `CenterID` tinyint(2) unsigned NOT NULL,
  `ProjectID` int(11) default NULL,
  PRIMARY KEY  (`UserID`, `CenterID`, `ProjectID`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
