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

product
  = token : token
    versionWithSlash : ( '/' productVersion ) ?
  {
    if (versionWithSlash) {
      return {
        token,
        version: versionWithSlash[1]
      }
    } else {
      return { token }
    }
  }

productVersion
  = version : token
  { return version }

token
  = token : ( tchar + )
  { return token.join('') }

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

comment
  = '(' text : ( ctext / quotedPair / comment ) * ')'
  { return '(' + text.join('') + ')' }

ctext
  = HTAB
  / SP
  / [\x21-\x27]
  / [\x2A-\x5B]
  / [\x5D-\x7E]
  / obsText

obsText
  = [\x80-\xFF]

quotedPair
  = '\\' char : ( HTAB / SP / VCHAR / obsText )
  { return '\\' + char }

HTAB
  = '\t'

SP
  = ' '

DIGIT
  = [0-9]

ALPHA
  = [a-z]i
  
VCHAR
  = [\x21-\x7E]

RWS
  = ( HTAB / SP ) +
  { return }
