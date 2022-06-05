If you are encountering issues, please take a look at the following log files
on your virtual machine and provide their contents in the issue description:
sudo cat /var/log/azure/custom-script/handler.log
sudo cat /var/log/waagent.log


1. Login to the venky-win-entry windows machine using RDP. This is exposed to public via public IP.
2. k3s master node is 10.0.0.4 - ssh into that 
ssh venkyuser@10.0.0.4
sudo apt update
sudo apt install -y openjdk-17-jdk

# This will install the master k3s node. Get the token and we need to use this on the slaves.
curl -sfL https://get.k3s.io | sh -
sudo cat /var/lib/rancher/k3s/server/node-token

# Get this token value from the prev command, and execute these 2 commands after replacing the token
# string. Do this on both the slave nodes.
export MASTER_TOKEN=K1094d933e40ab6812537e6b3bb2de00ca3c24097d0b7b6dad90bb67bf03086e558::server:030dca7b17ecba76559190eef04cb1ac
curl -sfL https://get.k3s.io | K3S_URL=https://10.0.0.4:6443 K3S_TOKEN=$MASTER_TOKEN sh -

## Execute this on the master node to see and make sure the 2 other nodes are registered.
venkyuser@venky-k3s-master-node:~$ sudo k3s kubectl get no
NAME                    STATUS   ROLES                  AGE     VERSION
venky-k3s-slave-1       Ready    <none>                 2m21s   v1.23.6+k3s1
venky-k3s-master-node   Ready    control-plane,master   7m32s   v1.23.6+k3s1
venky-k3s-slave-2       Ready    <none>                 20s     v1.23.6+k3s1

# next let us try a quick deployment to make sure it works
sudo k3s kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
sudo k3s kubectl expose deployment kubernetes-bootcamp --type=LoadBalancer --name=my-service --port=8080 --target-port=8080

# open browser to check http://10.0.0.4:8080/ -- and we should see a page.

# Scale
sudo k3s kubectl scale deployment kubernetes-bootcamp --replicas=3

# Check to make sure pods have scaled
sudo k3s kubectl get po -o wide

## Get the yugabyte shell 
wget -q -O - https://downloads.yugabyte.com/get_clients.sh | sh

yugabyte*/bin/ysqlsh --host=192.168.0.4
CREATE DATABASE yb_demo;
\c yb_demo;
CREATE TABLE IF NOT EXISTS public.dept (
    deptno integer NOT NULL,
    dname text,
    loc text,
    description text,
    CONSTRAINT pk_dept PRIMARY KEY (deptno asc)
);
CREATE TABLE IF NOT EXISTS emp (
    empno integer generated by default as identity (start with 10000) NOT NULL,
    ename text NOT NULL,
    job text,
    mgr integer,
    hiredate date,
    sal integer,
    comm integer,
    deptno integer NOT NULL,
    email text,
    other_info jsonb,
    CONSTRAINT pk_emp PRIMARY KEY (empno hash),
    CONSTRAINT emp_email_uk UNIQUE (email),
    CONSTRAINT fk_deptno FOREIGN KEY (deptno) REFERENCES dept(deptno),
    CONSTRAINT fk_mgr FOREIGN KEY (mgr) REFERENCES emp(empno),
    CONSTRAINT emp_email_check CHECK ((email ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'::text))
);
INSERT INTO dept (deptno,  dname,        loc, description)
   values    (10,     'ACCOUNTING', 'NEW YORK','preparation of financial statements, maintenance of general ledger, payment of bills, preparation of customer bills, payroll, and more.'),
             (20,     'RESEARCH',   'DALLAS','responsible for preparing the substance of a research report or security recommendation.'),
             (30,     'SALES',      'CHICAGO','division of a business that is responsible for selling products or services'),
             (40,     'OPERATIONS', 'BOSTON','administration of business practices to create the highest level of efficiency possible within an organization');
INSERT INTO emp (empno, ename,    job,        mgr,   hiredate,     sal, comm, deptno, email, other_info)
   values   (7369, 'SMITH',  'CLERK',     7902, '1980-12-17',  800, NULL,   20,'SMITH@acme.com', '{"skills":["accounting"]}'),
            (7499, 'ALLEN',  'SALESMAN',  7698, '1981-02-20', 1600,  300,   30,'ALLEN@acme.com', null),
            (7521, 'WARD',   'SALESMAN',  7698, '1981-02-22', 1250,  500,   30,'WARD@compuserve.com', null),
            (7566, 'JONES',  'MANAGER',   7839, '1981-04-02', 2975, NULL,   20,'JONES@gmail.com', null),
            (7654, 'MARTIN', 'SALESMAN',  7698, '1981-09-28', 1250, 1400,   30,'MARTIN@acme.com', null),
            (7698, 'BLAKE',  'MANAGER',   7839, '1981-05-01', 2850, NULL,   30,'BLAKE@hotmail.com', null),
            (7782, 'CLARK',  'MANAGER',   7839, '1981-06-09', 2450, NULL,   10,'CLARK@acme.com', '{"skills":["C","C++","SQL"]}'),
            (7788, 'SCOTT',  'ANALYST',   7566, '1982-12-09', 3000, NULL,   20,'SCOTT@acme.com', '{"cat":"tiger"}'),
            (7839, 'KING',   'PRESIDENT', NULL, '1981-11-17', 5000, NULL,   10,'KING@aol.com', null),
            (7844, 'TURNER', 'SALESMAN',  7698, '1981-09-08', 1500,    0,   30,'TURNER@acme.com', null),
            (7876, 'ADAMS',  'CLERK',     7788, '1983-01-12', 1100, NULL,   20,'ADAMS@acme.org', null),
            (7900, 'JAMES',  'CLERK',     7698, '1981-12-03',  950, NULL,   30,'JAMES@acme.org', null),
            (7902, 'FORD',   'ANALYST',   7566, '1981-12-03', 3000, NULL,   20,'FORD@acme.com', '{"skills":["SQL","CQL"]}'),
            (7934, 'MILLER', 'CLERK',     7782, '1982-01-23', 1300, NULL,   10,'MILLER@acme.com', null);
\d emp

select * from emp;

This proves out a lot of stuff - VPC peering etc.

CREATE ROLE admin WITH LOGIN PASSWORD '';