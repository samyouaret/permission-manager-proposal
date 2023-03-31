drop table if exists rules;
	CREATE TABLE rules (
	  id SERIAL PRIMARY KEY,
	  user_id  INTEGER,
	  action TEXT NOT NULL,
	  subject TEXT,
	  fields TEXT[],
	  conditions JSONB,
	  inverted BOOLEAN,
	  reason TEXT
	);

insert into rules(user_id,action, subject,inverted,conditions) 
values (122, 'deleteUser','User',false, '{"isAuthor":true}')

insert into rules(user_id,action, subject,inverted,conditions)
values (122, 'manage','User',false, '{"isAuthor":true}')

Select * from rules;