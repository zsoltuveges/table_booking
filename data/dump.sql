--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1
DROP TABLE IF EXISTS individuals;
DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS table_number;
DROP TABLE IF EXISTS zip_codes;
DROP SEQUENCE IF EXISTS individuals_id_seq;
DROP SEQUENCE IF EXISTS company_id_seq;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: company; Type: TABLE; Schema: public; Owner: uvegeszsolt
--

CREATE TABLE company (
    id integer NOT NULL,
    booking_id character varying NOT NULL,
    company_name text NOT NULL,
    comp_email text NOT NULL,
    comp_phone_number text NOT NULL,
    booked_tables INT NOT NULL,
    zip_code NUMERIC(4) NOT NULL,
    city text NOT NULL,
    street_address text NOT NULL,
    street_type text NOT NULL,
    street_num INT NOT NULL,
    floor_door text,
    vat_number NUMERIC(11) NOT NULL,
    date TIMESTAMP NOT NULL
);


ALTER TABLE company OWNER TO uvegeszsolt;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: uvegeszsolt
--

CREATE SEQUENCE company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE company_id_seq OWNER TO uvegeszsolt;

--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: uvegeszsolt
--

ALTER SEQUENCE company_id_seq OWNED BY company.id;


--
-- Name: individuals; Type: TABLE; Schema: public; Owner: uvegeszsolt
--

CREATE TABLE individuals (
    booking_id character varying NOT NULL,
    name character varying NOT NULL,
    email text NOT NULL,
    phone_number text,
    booked_tables integer,
    id integer NOT NULL,
    date TIMESTAMP NOT NULL
);


ALTER TABLE individuals OWNER TO uvegeszsolt;

--
-- Name: individuals_id_seq; Type: SEQUENCE; Schema: public; Owner: uvegeszsolt
--

CREATE SEQUENCE individuals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE individuals_id_seq OWNER TO uvegeszsolt;

--
-- Name: individuals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: uvegeszsolt
--

ALTER SEQUENCE individuals_id_seq OWNED BY individuals.id;


--
-- Name: table_number; Type: TABLE; Schema: public; Owner: uvegeszsolt
--

CREATE TABLE table_number (
    remaining_tables integer NOT NULL
);


ALTER TABLE table_number OWNER TO uvegeszsolt;

--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: uvegeszsolt
--

ALTER TABLE ONLY company ALTER COLUMN id SET DEFAULT nextval('company_id_seq'::regclass);


--
-- Name: individuals id; Type: DEFAULT; Schema: public; Owner: uvegeszsolt
--

ALTER TABLE ONLY individuals ALTER COLUMN id SET DEFAULT nextval('individuals_id_seq'::regclass);


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: uvegeszsolt
--

COPY company (id, booking_id, name, email, phone_number) FROM stdin;
\.


--
-- Data for Name: individuals; Type: TABLE DATA; Schema: public; Owner: uvegeszsolt
--

COPY individuals (booking_id, name, email, phone_number, count_table, id) FROM stdin;
\.


--
-- Data for Name: table_number; Type: TABLE DATA; Schema: public; Owner: uvegeszsolt
--

COPY table_number (remaining_tables) FROM stdin;
\.


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: uvegeszsolt
--

SELECT pg_catalog.setval('company_id_seq', 1, false);


--
-- Name: individuals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: uvegeszsolt
--

SELECT pg_catalog.setval('individuals_id_seq', 1, false);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: uvegeszsolt
--

ALTER TABLE ONLY company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: individuals individuals_id_pk; Type: CONSTRAINT; Schema: public; Owner: uvegeszsolt
--

ALTER TABLE ONLY individuals
    ADD CONSTRAINT individuals_id_pk PRIMARY KEY (id);


--
-- Name: company_email_uindex; Type: INDEX; Schema: public; Owner: uvegeszsolt
--

CREATE UNIQUE INDEX company_email_uindex ON company USING btree (email);


--
-- Name: company_id_uindex; Type: INDEX; Schema: public; Owner: uvegeszsolt
--

CREATE UNIQUE INDEX company_id_uindex ON company USING btree (id);


--
-- Name: individuals_email_uindex; Type: INDEX; Schema: public; Owner: uvegeszsolt
--

CREATE UNIQUE INDEX individuals_email_uindex ON individuals USING btree (email);


--
-- Name: individuals_id_uindex; Type: INDEX; Schema: public; Owner: uvegeszsolt
--

CREATE UNIQUE INDEX individuals_id_uindex ON individuals USING btree (id);


--
-- PostgreSQL database dump complete
--

CREATE SEQUENCE company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE;

CREATE SEQUENCE individuals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE;

ALTER TABLE ONLY company
  ALTER COLUMN id
  SET DEFAULT nextval('company_id_seq'::regclass);

ALTER TABLE ONLY individuals
  ALTER COLUMN id
  SET DEFAULT nextval('individuals_id_seq'::regclass);