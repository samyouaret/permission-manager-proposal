drop table if exists roles;
	CREATE TABLE roles (
	  name varchar PRIMARY KEY NOT NULL,
	  description TEXT
	);

drop table if exists permissions;
	CREATE TABLE permissions (
	  name VARCHAR PRIMARY KEY NOT NULL,
	  action VARCHAR NOT NULL,
	  subject VARCHAR,
	  fields VARCHAR[],
	  conditions JSONB,
	  inverted BOOLEAN,
	  reason VARCHAR
	);

drop table if exists role_permissions;
	CREATE TABLE role_permissions (
	  role_name VARCHAR NOT NULL,
	  permission_name VARCHAR NOT NULL,
	  FOREIGN KEY (role_name) REFERENCES roles(name),
	  FOREIGN KEY (permission_name) REFERENCES permissions(name),
	  PRIMARY KEY (role_name, permission_name)
	);

drop table if exists assignments;
	CREATE TABLE assignments (
	  user_id VARCHAR NOT NULL,
	  role_name VARCHAR NOT NULL,
	  FOREIGN KEY (role_name) REFERENCES roles(name),
	  PRIMARY KEY (user_id, role_name)
	);