CREATE TABLE site_caida_rv2_pfx2as(
  "cidr" TEXT,
  "asn" INTEGER,
  "asn_name" TEXT,
  "dec_start" INTEGER,
  "dec_end" INTEGER,
  "dec_width" INTEGER,
  PRIMARY KEY (dec_start,dec_end)
);
CREATE UNIQUE INDEX idx_site_ipdec ON site_caida_rv2_pfx2as (dec_start,dec_end);
INSERT INTO site_caida_rv2_pfx2as SELECT c.cidr,c.asn,a.name,c.dec_start,c.dec_end,c.dec_width FROM caida_rv2_pfx2as c JOIN asn_names a ON a.asn=c.asn;
PRAGMA journal_mode = delete;
PRAGMA page_size = 4096;
VACUUM;
