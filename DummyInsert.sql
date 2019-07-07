USE scouting;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM alliance_member;
DELETE FROM matches;
DELETE FROM frc_event;
DELETE FROM team;
INSERT INTO team VALUES (2994, 'ASTECHZ'), 
						(6135, 'Arctos'),
                        (6878, 'Panthera Tech'),
                        (5406, 'Celt-X'),
                        (1310, 'Runneymede Robotics'),
                        (4525, 'Renaissance Robotics'), 
                        (4519, 'King\'s Robotics');
                        
INSERT INTO frc_event VALUES ('ONOSH');

INSERT INTO matches VALUES (1, 'ONOSH', FALSE);
INSERT INTO matches VALUES (2, 'ONOSH', FALSE);
INSERT INTO matches VALUES (3, 'ONOSH', FALSE);
INSERT INTO matches VALUES (5, 'ONOSH', FALSE);
INSERT INTO matches VALUES (2, 'ONOSH', TRUE);
INSERT INTO matches VALUES (4, 'ONOSH', TRUE);

INSERT INTO alliance VALUES (NULL, 1, 'ONOSH', FALSE, 'blue');
INSERT INTO alliance VALUES (NULL, 1, 'ONOSH', FALSE, 'red');
INSERT INTO alliance VALUES (NULL, 2, 'ONOSH', FALSE, 'blue');
INSERT INTO alliance VALUES (NULL, 2, 'ONOSH', FALSE, 'red');
INSERT INTO alliance VALUES (NULL, 3, 'ONOSH', FALSE, 'red');
INSERT INTO alliance VALUES (NULL, 3, 'ONOSH', FALSE, 'blue');
INSERT INTO alliance VALUES (NULL, 5, 'ONOSH', FALSE, 'blue');
INSERT INTO alliance VALUES (NULL, 5, 'ONOSH', FALSE, 'red');
INSERT INTO alliance VALUES (NULL, 2, 'ONOSH', TRUE, 'blue');
INSERT INTO alliance VALUES (NULL, 4, 'ONOSH', TRUE, 'red');
    
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'blue'), 
									6135);
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'blue'), 
									2994);
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'blue'), 
									5406);                                    
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'),
									6878);
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'), 
									4519); 
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'), 
									1310);         
                                    
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 2 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'), 
									6135); 
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 3 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'blue'), 
									6135); 
INSERT INTO alliance_member VALUES ((SELECT id FROM alliance a WHERE a.match_number = 5 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'), 
									6135);                                             
                                    
INSERT INTO alliance_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'blue'), 
									38,
                                    FALSE,
                                    TRUE);
 INSERT INTO alliance_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'), 
									33,
                                    FALSE,
                                    FALSE);  
                                    
INSERT INTO alliance_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 2 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'), 
									62,
                                    TRUE,
                                    FALSE);  
INSERT INTO alliance_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 3 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'blue'), 
									78,
                                    TRUE,
                                    TRUE);  
INSERT INTO alliance_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 5 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'), 
									29,
                                    TRUE,
                                    FALSE);                                      
                                    
INSERT INTO alliance_member_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'blue'),
											6135,
                                            2,
                                            0,
                                            1,
                                            3,
                                            4,
                                            2,
                                            0,
                                            5);
INSERT INTO alliance_member_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 1 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'),
											6878,
                                            2,
                                            1,
                                            0,
                                            5,
                                            0,
                                            2,
                                            3,
                                            0);                                            
INSERT INTO alliance_member_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 2 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'),
											6135,
                                            0,
                                            1,
                                            0,
                                            2,
                                            3,
                                            1,
                                            0,
                                            0);								
INSERT INTO alliance_member_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 3 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'blue'),
											6135,
                                            2,
                                            0,
                                            1,
                                            0,
                                            7,
                                            2,
                                            0,
                                            15);
INSERT INTO alliance_member_outcome VALUES ((SELECT id FROM alliance a WHERE a.match_number = 5 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red'),
											6135,
                                            2,
                                            0,
                                            1,
                                            3,
                                            4,
                                            2,
                                            3,
                                            0);                                            
