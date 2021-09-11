## ASN & IP lookup database static hosting

Build of https://github.com/christianchristensen/asn_ip_lookup

1G+ sqlite db file with ip range lookups,

Web use enabled by: https://github.com/phiresky/sql.js-httpvfs

---

Site specific build information:

[`create_db.sh`](https://github.com/phiresky/sql.js-httpvfs/blob/master/create_db.sh)
(Note: osx specific `split` and `stat` can be found @ [ftp.gnu.org:coreutils](https://github.com/Homebrew/homebrew-core/blob/HEAD/Formula/coreutils.rb))
[`asn_ip.db`](https://github.com/christianchristensen/asn_ip_lookup) to output directory `db_dir`:
```
./create_db.sh asn_ip.db db_dir
```

Using [sql.js-httpvfs](https://github.com/phiresky/sql.js-httpvfs) instructions, generate dist
```
./node_modules/.bin/webpack --mode=production
./node_modules/.bin/http-server
```
