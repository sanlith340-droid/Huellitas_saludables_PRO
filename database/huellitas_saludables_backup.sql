--
-- PostgreSQL database dump
--

\restrict EaLIbwOcI0KPjfCjwngvV7VavirU5YNTGTpQFI0Cgy0UofVjfVHSGsX4rVMRqcv

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cita (
    id_cita integer NOT NULL,
    id_mascota integer NOT NULL,
    id_disponibilidad integer NOT NULL,
    id_recepcionista character varying(15) NOT NULL,
    motivos text,
    estado character varying(10) DEFAULT 'p'::character varying NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT cita_estado_check CHECK (((estado)::text = ANY ((ARRAY['p'::character varying, 'c'::character varying, 'cdo'::character varying])::text[])))
);


ALTER TABLE public.cita OWNER TO postgres;

--
-- Name: cita_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cita_id_cita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cita_id_cita_seq OWNER TO postgres;

--
-- Name: cita_id_cita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cita_id_cita_seq OWNED BY public.cita.id_cita;


--
-- Name: disponibilidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disponibilidad (
    id_disponibilidad integer NOT NULL,
    id_usuario character varying(15) NOT NULL,
    fecha date NOT NULL,
    estado character varying(20) DEFAULT 'disponible'::character varying NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    CONSTRAINT chk_disp_horas CHECK ((hora_fin > hora_inicio))
);


ALTER TABLE public.disponibilidad OWNER TO postgres;

--
-- Name: disponibilidad_id_disponibilidad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disponibilidad_id_disponibilidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disponibilidad_id_disponibilidad_seq OWNER TO postgres;

--
-- Name: disponibilidad_id_disponibilidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disponibilidad_id_disponibilidad_seq OWNED BY public.disponibilidad.id_disponibilidad;


--
-- Name: historia_clinica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historia_clinica (
    id_hc integer NOT NULL,
    id_cita integer NOT NULL,
    diagnostico text,
    tratamiento text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.historia_clinica OWNER TO postgres;

--
-- Name: historia_clinica_id_hc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historia_clinica_id_hc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historia_clinica_id_hc_seq OWNER TO postgres;

--
-- Name: historia_clinica_id_hc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historia_clinica_id_hc_seq OWNED BY public.historia_clinica.id_hc;


--
-- Name: mascota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mascota (
    id_mascota integer NOT NULL,
    nombre character varying(100) NOT NULL,
    fecha_nacimiento date,
    id_raza integer NOT NULL,
    genero character varying(1),
    especie character varying(50),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT mascota_genero_check CHECK (((genero)::text = ANY ((ARRAY['M'::character varying, 'H'::character varying])::text[])))
);


ALTER TABLE public.mascota OWNER TO postgres;

--
-- Name: mascota_id_mascota_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mascota_id_mascota_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mascota_id_mascota_seq OWNER TO postgres;

--
-- Name: mascota_id_mascota_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mascota_id_mascota_seq OWNED BY public.mascota.id_mascota;


--
-- Name: mascota_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mascota_usuario (
    id_mascota integer NOT NULL,
    id_usuario character varying(15) NOT NULL
);


ALTER TABLE public.mascota_usuario OWNER TO postgres;

--
-- Name: raza; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raza (
    id_raza integer NOT NULL,
    nombre character varying(100) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.raza OWNER TO postgres;

--
-- Name: raza_id_raza_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.raza_id_raza_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.raza_id_raza_seq OWNER TO postgres;

--
-- Name: raza_id_raza_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.raza_id_raza_seq OWNED BY public.raza.id_raza;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario character varying(15) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    correo character varying(150) NOT NULL,
    telefono character varying(20),
    direccion character varying(200),
    rol character varying(30) NOT NULL,
    especializacion character varying(100),
    tipo character varying(30),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    contrasena character varying(255) NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: cita id_cita; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita ALTER COLUMN id_cita SET DEFAULT nextval('public.cita_id_cita_seq'::regclass);


--
-- Name: disponibilidad id_disponibilidad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidad ALTER COLUMN id_disponibilidad SET DEFAULT nextval('public.disponibilidad_id_disponibilidad_seq'::regclass);


--
-- Name: historia_clinica id_hc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historia_clinica ALTER COLUMN id_hc SET DEFAULT nextval('public.historia_clinica_id_hc_seq'::regclass);


--
-- Name: mascota id_mascota; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascota ALTER COLUMN id_mascota SET DEFAULT nextval('public.mascota_id_mascota_seq'::regclass);


--
-- Name: raza id_raza; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raza ALTER COLUMN id_raza SET DEFAULT nextval('public.raza_id_raza_seq'::regclass);


--
-- Data for Name: cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cita (id_cita, id_mascota, id_disponibilidad, id_recepcionista, motivos, estado, fecha_registro) FROM stdin;
1	1	1	3000000001	Consulta de rutina	p	2026-08-21 22:48:21.837933
2	2	2	3000000001	Vacunacion anual	c	2026-08-21 22:48:21.837933
3	3	3	3000000001	Revision por vomito	cdo	2026-08-21 22:48:21.837933
4	4	4	3000000001	Control de peso	p	2026-08-21 22:48:21.837933
5	5	5	3000000001	Desparasitacion	c	2026-08-21 22:48:21.837933
6	6	6	3000000001	Cirugia menor de esterilizacion	cdo	2026-08-21 22:48:21.837933
7	7	7	3000000001	Revision de piel	p	2026-08-21 22:48:21.837933
8	8	8	3000000001	Consulta por alergia	c	2026-08-21 22:48:21.837933
9	9	9	3000000001	Chequeo general	cdo	2026-08-21 22:48:21.837933
\.


--
-- Data for Name: disponibilidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disponibilidad (id_disponibilidad, id_usuario, fecha, estado, hora_inicio, hora_fin) FROM stdin;
1	2000000001	2026-08-20	ocupado	08:00:00	09:00:00
2	2000000001	2026-08-20	ocupado	09:00:00	10:00:00
3	2000000001	2026-08-20	disponible	10:00:00	11:00:00
4	2000000002	2026-08-21	ocupado	08:00:00	09:00:00
5	2000000002	2026-08-21	ocupado	09:00:00	10:00:00
6	2000000002	2026-08-21	disponible	10:00:00	11:00:00
7	2000000003	2026-08-22	ocupado	08:00:00	09:00:00
8	2000000003	2026-08-22	ocupado	09:00:00	10:00:00
9	2000000003	2026-08-22	disponible	10:00:00	11:00:00
\.


--
-- Data for Name: historia_clinica; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historia_clinica (id_hc, id_cita, diagnostico, tratamiento, fecha_registro) FROM stdin;
\.


--
-- Data for Name: mascota; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mascota (id_mascota, nombre, fecha_nacimiento, id_raza, genero, especie, fecha_registro) FROM stdin;
1	Firulais	2021-03-10	1	M	perro	2026-08-21 22:45:59.133822
2	Michi	2020-07-15	4	H	gato	2026-08-21 22:45:59.133822
3	Toby	2019-11-02	2	M	perro	2026-08-21 22:45:59.133822
4	Luna	2022-01-20	5	H	gato	2026-08-21 22:45:59.133822
5	Max	2021-05-05	3	M	perro	2026-08-21 22:45:59.133822
6	Nala	2020-09-12	2	H	perro	2026-08-21 22:45:59.133822
7	Rocky	2018-12-30	1	M	perro	2026-08-21 22:45:59.133822
8	Mia	2021-08-08	4	H	gato	2026-08-21 22:45:59.133822
9	Simon	2019-04-17	5	M	gato	2026-08-21 22:45:59.133822
10	Bella	2022-02-25	3	H	perro	2026-08-21 22:45:59.133822
11	Zeus	2020-06-19	1	M	perro	2026-08-21 22:45:59.133822
12	Coco	2021-10-01	4	H	gato	2026-08-21 22:45:59.133822
13	Duke	2019-01-14	2	M	perro	2026-08-21 22:45:59.133822
14	Kira	2020-03-23	5	H	gato	2026-08-21 22:45:59.133822
15	Thor	2021-07-07	3	M	perro	2026-08-21 22:45:59.133822
16	Lola	2022-04-11	2	H	perro	2026-08-21 22:45:59.133822
17	Bruno	2018-09-09	1	M	perro	2026-08-21 22:45:59.133822
18	Nina	2020-11-28	4	H	gato	2026-08-21 22:45:59.133822
19	Leo	2019-05-06	5	M	gato	2026-08-21 22:45:59.133822
20	Chispa	2021-12-15	3	H	perro	2026-08-21 22:45:59.133822
\.


--
-- Data for Name: mascota_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mascota_usuario (id_mascota, id_usuario) FROM stdin;
1	1000000001
2	1000000002
3	1000000003
4	1000000004
5	1000000005
6	1000000006
7	1000000007
8	1000000008
9	1000000009
10	1000000010
11	1000000011
12	1000000012
13	1000000013
14	1000000014
15	1000000015
16	1000000016
17	1000000017
18	1000000018
19	1000000019
20	1000000020
\.


--
-- Data for Name: raza; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raza (id_raza, nombre, fecha_registro) FROM stdin;
1	Labrador	2026-08-21 22:38:22.597585
2	Criollo	2026-08-21 22:38:22.597585
3	Poodle	2026-08-21 22:38:22.597585
4	Siames	2026-08-21 22:38:22.597585
5	Persa	2026-08-21 22:38:22.597585
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombre, apellido, correo, telefono, direccion, rol, especializacion, tipo, fecha_registro, contrasena) FROM stdin;
1000000001	Carlos	Ramirez	carlos.ramirez1@correo.com	3001234501	Cra 10 # 20-30	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1001
1000000002	Maria	Gonzalez	maria.gonzalez2@correo.com	3001234502	Cra 11 # 21-31	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1002
1000000003	Andres	Lopez	andres.lopez3@correo.com	3001234503	Cra 12 # 22-32	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1003
1000000004	Laura	Martinez	laura.martinez4@correo.com	3001234504	Cra 13 # 23-33	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1004
1000000005	Juan	Perez	juan.perez5@correo.com	3001234505	Cra 14 # 24-34	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1005
1000000006	Camila	Diaz	camila.diaz6@correo.com	3001234506	Cra 15 # 25-35	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1006
1000000007	Sebastian	Herrera	sebastian.herrera7@correo.com	3001234507	Cra 16 # 26-36	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1007
1000000008	Valentina	Castro	valentina.castro8@correo.com	3001234508	Cra 17 # 27-37	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1008
1000000009	Daniel	Rojas	daniel.rojas9@correo.com	3001234509	Cra 18 # 28-38	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1009
1000000010	Paula	Vargas	paula.vargas10@correo.com	3001234510	Cra 19 # 29-39	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1010
1000000011	Felipe	Moreno	felipe.moreno11@correo.com	3001234511	Cra 20 # 30-40	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1011
1000000012	Sofia	Jimenez	sofia.jimenez12@correo.com	3001234512	Cra 21 # 31-41	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1012
1000000013	Julian	Torres	julian.torres13@correo.com	3001234513	Cra 22 # 32-42	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1013
1000000014	Natalia	Ortiz	natalia.ortiz14@correo.com	3001234514	Cra 23 # 33-43	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1014
1000000015	Diego	Silva	diego.silva15@correo.com	3001234515	Cra 24 # 34-44	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1015
1000000016	Mariana	Rincon	mariana.rincon16@correo.com	3001234516	Cra 25 # 35-45	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1016
1000000017	Santiago	Buitrago	santiago.buitrago17@correo.com	3001234517	Cra 26 # 36-46	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1017
1000000018	Isabella	Cruz	isabella.cruz18@correo.com	3001234518	Cra 27 # 37-47	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1018
1000000019	Jorge	Paez	jorge.paez19@correo.com	3001234519	Cra 28 # 38-48	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1019
1000000020	Sara	Calderon	sara.calderon20@correo.com	3001234520	Cra 29 # 39-49	usuario	\N	principal	2026-08-21 22:38:34.045684	Clave1020
2000000001	Ricardo	Fonseca	ricardo.fonseca@huellitas.com	3109876501	Clinica sede norte	veterinario	medicina general	principal	2026-08-21 22:39:58.525715	VetClave01
2000000002	Alejandra	Nino	alejandra.nino@huellitas.com	3109876502	Clinica sede sur	veterinario	cirugia	principal	2026-08-21 22:39:58.525715	VetClave02
2000000003	Esteban	Salazar	esteban.salazar@huellitas.com	3109876503	Clinica sede centro	veterinario	dermatologia	principal	2026-08-21 22:39:58.525715	VetClave03
3000000001	Katherine	Pena	katherine.pena@huellitas.com	3201112233	Recepcion sede norte	recepcionista	\N	principal	2026-08-21 22:41:20.509716	RecepClave01
\.


--
-- Name: cita_id_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cita_id_cita_seq', 9, true);


--
-- Name: disponibilidad_id_disponibilidad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disponibilidad_id_disponibilidad_seq', 9, true);


--
-- Name: historia_clinica_id_hc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historia_clinica_id_hc_seq', 1, false);


--
-- Name: mascota_id_mascota_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mascota_id_mascota_seq', 20, true);


--
-- Name: raza_id_raza_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raza_id_raza_seq', 5, true);


--
-- Name: cita cita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_pkey PRIMARY KEY (id_cita);


--
-- Name: disponibilidad disponibilidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidad
    ADD CONSTRAINT disponibilidad_pkey PRIMARY KEY (id_disponibilidad);


--
-- Name: historia_clinica historia_clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historia_clinica
    ADD CONSTRAINT historia_clinica_pkey PRIMARY KEY (id_hc);


--
-- Name: mascota mascota_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascota
    ADD CONSTRAINT mascota_pkey PRIMARY KEY (id_mascota);


--
-- Name: mascota_usuario mascota_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascota_usuario
    ADD CONSTRAINT mascota_usuario_pkey PRIMARY KEY (id_mascota, id_usuario);


--
-- Name: raza raza_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raza
    ADD CONSTRAINT raza_pkey PRIMARY KEY (id_raza);


--
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: idx_cita_disponibilidad; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cita_disponibilidad ON public.cita USING btree (id_disponibilidad);


--
-- Name: idx_cita_mascota; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cita_mascota ON public.cita USING btree (id_mascota);


--
-- Name: idx_cita_recepcionista; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cita_recepcionista ON public.cita USING btree (id_recepcionista);


--
-- Name: idx_disponibilidad_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_disponibilidad_usuario ON public.disponibilidad USING btree (id_usuario);


--
-- Name: idx_historia_cita; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historia_cita ON public.historia_clinica USING btree (id_cita);


--
-- Name: idx_mascota_raza; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mascota_raza ON public.mascota USING btree (id_raza);


--
-- Name: cita fk_cita_disponibilidad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_disponibilidad FOREIGN KEY (id_disponibilidad) REFERENCES public.disponibilidad(id_disponibilidad);


--
-- Name: cita fk_cita_mascota; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_mascota FOREIGN KEY (id_mascota) REFERENCES public.mascota(id_mascota);


--
-- Name: cita fk_cita_recepcionista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_recepcionista FOREIGN KEY (id_recepcionista) REFERENCES public.usuario(id_usuario);


--
-- Name: disponibilidad fk_disp_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidad
    ADD CONSTRAINT fk_disp_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: historia_clinica fk_hc_cita; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historia_clinica
    ADD CONSTRAINT fk_hc_cita FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita);


--
-- Name: mascota fk_mascota_raza; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascota
    ADD CONSTRAINT fk_mascota_raza FOREIGN KEY (id_raza) REFERENCES public.raza(id_raza);


--
-- Name: mascota_usuario fk_mu_mascota; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascota_usuario
    ADD CONSTRAINT fk_mu_mascota FOREIGN KEY (id_mascota) REFERENCES public.mascota(id_mascota);


--
-- Name: mascota_usuario fk_mu_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascota_usuario
    ADD CONSTRAINT fk_mu_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- PostgreSQL database dump complete
--

\unrestrict EaLIbwOcI0KPjfCjwngvV7VavirU5YNTGTpQFI0Cgy0UofVjfVHSGsX4rVMRqcv

