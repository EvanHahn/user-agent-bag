// User-Agent = product *( RWS ( product / comment ) )
// https://tools.ietf.org/html/rfc7231#section-5.5.3
userAgent
  = firstProduct : product
    restWithWhitespace : ( RWS ( product / comment ) ) *
  {
    const rest = restWithWhitespace
      .map(entry => {
        const result = entry[1]
        if (typeof result === 'string') {
          return {
            type: 'comment',
            text: result.substring(1, result.length - 1)
          }
        } else {
          return result
        }
      })
    return [firstProduct].concat(rest)
  }

// product = token ["/" product-version]
// product-version = token
// https://tools.ietf.org/html/rfc7231#section-5.5.3
product
  = token : token
    versionWithSlash : ( '/' token ) ?
  {
    const version = versionWithSlash ? versionWithSlash[1] : null
    return {
      type: 'product',
      product: token,
      version
    }
  }

// token = 1*tchar
// https://tools.ietf.org/html/rfc7230#section-3.2.6
token
  = token : ( tchar + )
  { return token.join('') }

// tchar = "!" / "#" / "$" / "%" / "&" / "'" / "*"
//       / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
//       / DIGIT / ALPHA
//       ; any VCHAR, except delimiters
// https://tools.ietf.org/html/rfc7230#section-3.2.6
tchar
  = '!'
  / '#'
  / '$'
  / '%'
  / '&'
  / "'"
  / '*'
  / '+'
  / '-'
  / '.'
  / '^'
  / '_'
  / '`'
  / '|'
  / '~'
  / DIGIT
  / ALPHA

// comment = "(" *( ctext / quoted-pair / comment ) ")"
// https://tools.ietf.org/html/rfc7230#section-3.2.6
comment
  = '(' text : ( ctext / quotedPair / comment ) * ')'
  { return '(' + text.join('') + ')' }

// ctext = HTAB / SP / %x21-27 / %x2A-5B / %x5D-7E / obs-text
// https://tools.ietf.org/html/rfc7230#section-3.2.6
ctext
  = HTAB
  / SP
  / [\x21-\x27]
  / [\x2A-\x5B]
  / [\x5D-\x7E]
  / obsText

// obs-text = %x80-FF
// https://tools.ietf.org/html/rfc7230#section-3.2.6
obsText
  = [\x80-\xFF]

// quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
// https://tools.ietf.org/html/rfc7230#section-3.2.6
quotedPair
  = '\\' char : ( HTAB / SP / VCHAR / obsText )
  { return '\\' + char }

// HTAB = %x09
//      ; horizontal tab
// https://tools.ietf.org/html/rfc5234#appendix-B.1
HTAB
  = '\t'

// SP = %x20
// https://tools.ietf.org/html/rfc5234#appendix-B.1
SP
  = ' '

// DIGIT = %x30-39
//       ; 0-9
// https://tools.ietf.org/html/rfc5234#appendix-B.1
DIGIT
  = [0-9]

// ALPHA = %x41-5A / %x61-7A
//       ; A-Z / a-z
ALPHA
  = [a-zA-Z]

// VCHAR = %x21-7E
//       ; visible (printing) characters
VCHAR
  = [\x21-\x7E]

// RWS = 1*( SP / HTAB )
// https://tools.ietf.org/html/rfc7230#appendix-B
RWS
  = ( HTAB / SP ) +
