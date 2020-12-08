ALTER TABLE community
ADD (comm_time DATETIME DEFAULT NOW());

ALTER TABLE Net.user
ADD (email_auth boolean not null default 0);

