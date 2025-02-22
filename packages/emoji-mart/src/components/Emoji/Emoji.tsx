import { Data } from '../../config'
import { SearchIndex } from '../../helpers'
import ReactDOMServer from 'preact/compat/server'
import ReactDOM from 'preact/compat'

export default function Emoji(props) {
  let { id, skin, emoji } = props

  if (props.shortcodes) {
    const matches = props.shortcodes.match(SearchIndex.SHORTCODES_REGEX)

    if (matches) {
      id = matches[1]

      if (matches[2]) {
        skin = matches[2]
      }
    }
  }

  emoji || (emoji = SearchIndex.get(id || props.native))
  if (!emoji) return props.fallback

  const emojiSkin = emoji.skins[skin - 1] || emoji.skins[0]

  const imageSrc =
    emojiSkin.src ||
    (props.set != 'native' && !props.spritesheet
      ? typeof props.getImageURL === 'function'
        ? props.getImageURL(props.set, emojiSkin.unified)
        : `https://cdn.jsdelivr.net/npm/emoji-datasource-${props.set}@14.0.0/img/${props.set}/64/${emojiSkin.unified}.png`
      : undefined)

  const spritesheetSrc =
    typeof props.getSpritesheetURL === 'function'
      ? props.getSpritesheetURL(props.set)
      : `https://cdn.jsdelivr.net/npm/emoji-datasource-${props.set}@14.0.0/img/${props.set}/sheets-256/64.png`

  const renderNative = () => {
    if (emojiSkin.render) {
      return (
        <span
          style={{
            fontSize: props.size,
            fontFamily:
              '"EmojiMart", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"',
          }}
          dangerouslySetInnerHTML={{
            __html: ReactDOMServer.renderToString(
              ReactDOM.cloneElement(emojiSkin.render),
            ),
          }}
        ></span>
      )
    }
    return (
      <span
        style={{
          fontSize: props.size,
          fontFamily:
            '"EmojiMart", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"',
        }}
      >
        {emojiSkin.native}
      </span>
    )
  }

  return (
    <span class="emoji-mart-emoji" data-emoji-set={props.set}>
      {imageSrc ? (
        <img
          style={{
            maxWidth: props.size || '1em',
            maxHeight: props.size || '1em',
            display: 'inline-block',
          }}
          alt={emojiSkin.native || emojiSkin.shortcodes}
          src={imageSrc}
        />
      ) : props.set == 'native' ? (
        renderNative()
      ) : (
        <span
          style={{
            display: 'block',
            width: props.size,
            height: props.size,
            backgroundImage: `url(${spritesheetSrc})`,
            backgroundSize: `${100 * Data.sheet.cols}% ${
              100 * Data.sheet.rows
            }%`,
            backgroundPosition: `${
              (100 / (Data.sheet.cols - 1)) * emojiSkin.x
            }% ${(100 / (Data.sheet.rows - 1)) * emojiSkin.y}%`,
          }}
        ></span>
      )}
    </span>
  )
}
