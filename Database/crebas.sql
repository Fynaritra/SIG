/*==============================================================*/
/* Nom de SGBD :  PostgreSQL 8                                  */
/* Date de cr�ation :  15/05/2019 21:55:36                      */
/*==============================================================*/


DROP VIEW TITRE;

DROP TABLE PROPRIETAIRE;

DROP TABLE TERRAIN;

DROP TABLE VILLE;

/*==============================================================*/
/* Table : DELIMITATION                                         */
/*==============================================================*/
/*==============================================================*/
/* Table : PROPRIETAIRE                                         */
/*==============================================================*/
CREATE TABLE PROPRIETAIRE (
   IDPROPRIETAIRE       VARCHAR(30)          NOT NULL,
   NOM                  VARCHAR(30)          NULL,
   NATIONALITE          VARCHAR(30)          NULL,
   CATEGORIE            VARCHAR(30)          NULL,
   CONSTRAINT PK_PROPRIETAIRE PRIMARY KEY (IDPROPRIETAIRE)
);

/*==============================================================*/
/* Table : TERRAIN                                              */
/*==============================================================*/
CREATE TABLE TERRAIN (
   IDTERRAIN            VARCHAR(30)          NOT NULL,
	VILLEID              VARCHAR(30)          NULL,
   IDPROPRIETAIRE       VARCHAR(30)			 NULL,
   PRIX                 DECIMAL(15,2)        NULL,
   GEOM 				GEOMETRY 			 NULL,
   ANNEE 			INTEGER				 NULL,
   CONSTRAINT PK_TERRAIN PRIMARY KEY (IDTERRAIN)
);


/*==============================================================*/
/* Table : VILLE                                                */
/*==============================================================*/
CREATE TABLE VILLE (
   VILLEID              VARCHAR(30)          NOT NULL,
   NOM                  VARCHAR(30)          NULL,
   LONGITUDE            DECIMAL(20,8)        NULL,
   LATITUDE             DECIMAL(20,8)        NULL,
   ZOOM                 INT8                 NULL,
   CONSTRAINT PK_VILLE PRIMARY KEY (VILLEID)
);

/*==============================================================*/
/* Vue : DETAILSTERRAIN                                         */
/*==============================================================*/
ALTER TABLE TERRAIN
   ADD CONSTRAINT FK_TERRAIN_REFERENCE_VILLE FOREIGN KEY (VILLEID)
      REFERENCES VILLE (VILLEID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TERRAIN
   ADD CONSTRAINT FK_TERRAIN_REFERENCE_PROPRIET FOREIGN KEY (IDPROPRIETAIRE)
      REFERENCES PROPRIETAIRE (IDPROPRIETAIRE)
      ON DELETE RESTRICT ON UPDATE RESTRICT;



CREATE SEQUENCE TERRAIN_SEQUENCE;

/*==============================================================*/
/* Table : DATA                                                */
/*==============================================================*/
insert into VILLE values ('V1','Andoharanofotsy',47.5411,-18.9791935,15);
insert into VILLE values ('V2','Tanjombato',47.527562,-18.87919,15);

insert into  PROPRIETAIRE values ('P1','Rabe','Malagasy', 'PRIVATE');
insert into  PROPRIETAIRE values ('P2','Rakoto','Malagasy', 'PUBLIC');

insert into TERRAIN values ('T1', 'V1', 'P1', 25000, ST_Polygon(ST_GeomFromText('LINESTRING(-18.975171 47.544723,-18.973669 47.54659 , -18.974562 47.547277, -18.973892 47.548779, -18.972208 47.549616, -18.970544 47.547706, -18.972837 47.545818 , -18.975171 47.544723 )'), 0), 1990);
insert into TERRAIN values ('T2', 'V1', 'P2', 30000, ST_Polygon(ST_GeomFromText('LINESTRING(-18.979769 47.544659 ,-18.980906 47.547577 ,-18.985674 47.549358 ,-18.984944 47.543028 ,-18.979769 47.544659 )'), 0), 1990);

select * from TERRAIN where st_intersects(TERRAIN.GEOM, ST_Polygon(ST_GeomFromText('LINESTRING(-18.979769 47.544659 ,-18.98005 47.547577 ,-18.985674 47.549358 ,-18.984944 47.543028 ,-18.979769 47.544659 )'), 0));

--Fonction qui convertit l'objet geometrique en objet JSON
SELECT ST_ASGEOJSON(geom) FROM TERRAIN;
--Fonction calcule de l'aire, en m²
SELECT ST_AREA(geom,false)*POWER(0.3048,2) from TERRAIN;

DROP VIEW TITRE;
CREATE VIEW TITRE AS SELECT ST_AREA(geom,false)*POWER(0.3048,2) as surfacePolygon, ST_ASGEOJSON(geom) as coordonnees, TERRAIN.idProprietaire, idTerrain, geom, nom, nationalite, categorie, PRIX, ANNEE FROM TERRAIN, PROPRIETAIRE WHERE TERRAIN.idProprietaire = PROPRIETAIRE.idProprietaire;

CREATE SEQUENCE TERRAIN_SEQUENCE;
SELECT NEXTVAL('terrain_sequence');
SELECT concat('T', SELECT NEXTVAL('terrain_sequence'));

CREATE TRIGGER idTerrainValue 
BEFORE INSERT ON TERRAIN
FOR EACH ROW SELECT NEXTVAL('TERRAIN_SEQUENCE');

--Fonction qui cherche l'intersection du terrain a ajouter
select * from terrain
where st_intersects(terrain.geom, select(st_polygon()));

SELECT AVG(PRIX) as average FROM TERRAIN WHERE ST_WITHIN(TERRAIN.GEOM, ST_BUFFER(ST_Polygon(ST_GeomFromText('LINESTRING(-18.978341 47.533426 ,-18.97966 47.544434 , -18.979498 47.541001, -18.9981283 47.538039 ,-18.981131 47.536358 , -18.978341 47.533426 , -18.974202 47.533748 ,  -18.971579 47.534563, -18.971073 47.537471 , -18.972614 47.539659 , -18.972908 47.54187 , -18.971894 47.542224 , -18.971843 47.544208 , -18.973902 47.544841, -18.978341 47.533426)'), 0), 0.00051));


SELECT ST_AsText((ST_Dump(ST_Split(polygon, line))).geom) As wkt
FROM (SELECT
    ST_MakeLine(ST_GeomFromText('LINESTRING(-18.979769 47.544659 ,-18.98005 47.547577 )'), 0) As line,
    ST_Polygon(ST_GeomFromText('LINESTRING(-18.979769 47.544659 ,-18.98005 47.547577 ,-18.985674 47.549358 ,-18.984944 47.543028 ,-18.979769 47.544659 )'), 0) As polygon) As foo;
