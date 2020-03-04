drop table DELIMITATION;

drop table PROPRIETAIRE;

drop table TITRE;

drop table VILLE;

/*==============================================================*/
/* Table : DELIMITATION                                         */
/*==============================================================*/
create table DELIMITATION (
   DELIMITATIONID       SERIAL               not null,
   LONGITUDE            DECIMAL(20,8)        null,
   LATITUDE             DECIMAL(20,8)        null,
   TITREID              INT4                 null,
   constraint PK_DELIMITATION primary key (DELIMITATIONID)
);

/*==============================================================*/
/* Table : PROPRIETAIRE                                         */
/*==============================================================*/
create table PROPRIETAIRE (
   PROPRIETAIREID       SERIAL               not null,
   NOM                  VARCHAR(30)          null,
   constraint PK_PROPRIETAIRE primary key (PROPRIETAIREID)
);

/*==============================================================*/
/* Table : TITRE                                                */
/*==============================================================*/
create table TITRE (
   TITREID              SERIAL               not null,
   SURFACE              DECIMAL(20,8)        null,
   VILLEID              INT4                 null,
   PROPRIETAIREID       INT4                 null,
   PRIX                 DECIMAL(10,4)        null,
   constraint PK_TITRE primary key (TITREID)
);

/*==============================================================*/
/* Table : VILLE                                                */
/*==============================================================*/
create table VILLE (
   VILLEID              SERIAL               not null,
   NOM                  VARCHAR(30)          null,
   LONGITUDE            DECIMAL(20,8)        null,
   LATITUDE             DECIMAL(20,8)        null,
   ZOOM                 INT8                 null,
   constraint PK_VILLE primary key (VILLEID)
);

alter table DELIMITATION
   add constraint FK_DELIMITA_REFERENCE_TITRE foreign key (TITREID)
      references TITRE (TITREID)
      on delete restrict on update restrict;

alter table TITRE
   add constraint FK_TITRE_REFERENCE_VILLE foreign key (VILLEID)
      references VILLE (VILLEID)
      on delete restrict on update restrict;

alter table TITRE
   add constraint FK_TITRE_REFERENCE_PROPRIET foreign key (PROPRIETAIREID)
      references PROPRIETAIRE (PROPRIETAIREID)
      on delete restrict on update restrict;


/*==============================================================*/
/* Table : DATA                                                */
/*==============================================================*/
insert into VILLE values (default,'Andoharanofotsy',47.5411,-18.9791935,15);
insert into VILLE values (default,'Tanjombato',47.527562,-18.87919,15);

insert into  PROPRIETAIRE values (default,'PUBLIC');
insert into  PROPRIETAIRE values (default,'PRIVATE');

insert into TITRE values (default, null,1,1,160);
insert into TITRE values (default, null,1,1,156);
insert into TITRE values (default, null,1,2,120);
insert into TITRE values (default, null,1,2,190);
insert into TITRE values (default, null,1,2,290);
insert into TITRE values (default, null,1,2,110);

--Polygone 1
insert into DELIMITATION values (default,47.544434,-18.97966,1);
insert into DELIMITATION values (default,47.541001,-18.979498,1);
insert into DELIMITATION values (default,47.538039,-18.9981283,1);
insert into DELIMITATION values (default,47.536358,-18.981131,1);
insert into DELIMITATION values (default,47.533426,-18.978341,1);
insert into DELIMITATION values (default,47.533748,-18.974202,1);
insert into DELIMITATION values (default,47.534563,-18.971579,1);
insert into DELIMITATION values (default,47.537471,-18.971073,1);
insert into DELIMITATION values (default,47.539659,-18.972614,1);
insert into DELIMITATION values (default,47.54187,-18.972908,1);
insert into DELIMITATION values (default,47.542224,-18.971894,1);
insert into DELIMITATION values (default,47.544208,-18.971843,1);
insert into DELIMITATION values (default,47.544841,-18.973902,1);

--Polygone 2
insert into DELIMITATION values (default,47.544723,-18.975171,2);
insert into DELIMITATION values (default,47.54659,-18.973669,2);
insert into DELIMITATION values (default,47.547277,-18.974562,2);
insert into DELIMITATION values (default,47.548779,-18.973892,2);
insert into DELIMITATION values (default,47.549616,-18.972208,2);
insert into DELIMITATION values (default,47.547706,-18.970544,2);
insert into DELIMITATION values (default,47.545818,-18.972837,2);

--Polygone 3
insert into DELIMITATION values (default,47.544487,-18.979677,3);
insert into DELIMITATION values (default,47.552491,-18.981605,3);
insert into DELIMITATION values (default,47.5488,-18.976918,3);
insert into DELIMITATION values (default,47.550238,-18.972758,3);
insert into DELIMITATION values (default,47.548779,-18.974056,3);
insert into DELIMITATION values (default,47.544766,-18.975396,3);

--Polygone 4
insert into DELIMITATION values (default,47.544251,-18.979851,4);
insert into DELIMITATION values (default,47.540861,-18.979526,4);
insert into DELIMITATION values (default,47.538093,-18.981555,4);
insert into DELIMITATION values (default,47.540368,-18.984378,4);
insert into DELIMITATION values (default,47.542728,-18.984822,4);

--Polygone 5
insert into DELIMITATION values (default,47.544659,-18.979769,5);
insert into DELIMITATION values (default,47.547577,-18.980906,5);
insert into DELIMITATION values (default,47.549358,-18.985674,5);
insert into DELIMITATION values (default,47.543028,-18.984944,5);

--Polygone 6
insert into DELIMITATION values (default,47.54305,-18.984984,6);
insert into DELIMITATION values (default,47.549187,-18.986181,6);
insert into DELIMITATION values (default,47.546268,-18.98886,6);
insert into DELIMITATION values (default,47.542642,-18.987338,6);