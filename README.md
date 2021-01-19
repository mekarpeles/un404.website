# un404.website
Bring a missing website back to life

![image](https://user-images.githubusercontent.com/978325/104973605-0b126780-59aa-11eb-8583-e856e4d0f9d8.png)

## URL Options

- `lmwbtfy` can take a URL for you, type it in, and submit the form
- `date` if specified, allows you to specify (a) a wayback 14-digit timestamp, e.g. 20210115144727, (b) or any subset of it w/ optional dashes, e.g. 2021-01-15 or 2021-01 or 2021
- `mode` selects how to wayback; the following options are valid `["oldest", "newest", "all", "save"]`. `date` takes precidence over `mode` as it uses its own special mode.

https://un404.website/?date=2018&lmwbtfy=http://missuteki.com


## Setup

This is a static website, to run it, you just need an nginx configuration which looks like this

```
server {
    root /path/to/un404.website;
    client_max_body_size 1M;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    listen 80;
}
```
