# jvc-cli [![npm version](http://img.shields.io/npm/v/jvc-cli.svg?style=flat-square)](https://www.npmjs.org/package/jvc-cli)

> CLI [jeuxvideo.com] client.

[jeuxvideo.com]: https://www.jeuxvideo.com/

Caution
-------

Same status as for [jvc](https://github.com/valeriangalliat/jvc#caution).

Usage
-----

### Login/logout

```
jvc login [<user>]
jvc logout
```

You will be prompted for your password during login action, and you may
be asked for a captcha. The captcha image will be downloaded in a
temporary file, and opened with [the appropriate software][open].

[open]: https://www.npmjs.com/package/open

### Private messages

```
jvc pm [<query>]
jvc next
```

Running `jvc pm` will list your last private messages. Running `jvc
next` after a `jvc pm` will load the next page (need [this issue][#1016]
to be fixed for the pagination to work).

[#1016]: https://github.com/babel/babel/issues/1016

When specifying a `<query>`, it will be used to match a thread in the
previous PM list, and show its last posts; if `<query>` is a number, the
thread is selected by ID, otherwise it's matched against the subject.
Using `jvc next` in this context will load the following (older)
messages.
