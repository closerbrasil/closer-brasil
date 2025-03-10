URL: https://tiptap.dev/docs/editor/extensions/nodes/youtube
---
This extension adds a new YouTube embed node to the editor.

Preview

ReactVue

Nodes/Youtube/React

Add YouTube video

Tiptap now supports YouTube embeds! Awesome!

Cercle Story - Chapter One (melodic mix) - YouTube

Cercle

3.34M subscribers

[Cercle Story - Chapter One (melodic mix)](https://www.youtube.com/watch?v=3lTUAWOgoHs)

Cercle

Search

Watch later

Share

Copy link

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

More videos

## More videos

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

[Watch on www.youtube.com](https://www.youtube.com/watch?v=3lTUAWOgoHs)

Watch on

Try adding your own video to this editor!

index.jsxstyles.scss Inspect

```
import './styles.scss'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'

const MenuBar = ({ editor }) => {
  const [height, setHeight] = React.useState(480)
  const [width, setWidth] = React.useState(640)

  if (!editor) {
    return null
  }

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(width, 10)) || 640,
        height: Math.max(180, parseInt(height, 10)) || 480,
      })
    }
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <input
          id="width"
          type="number"
          min="320"
          max="1024"
          placeholder="width"
          value={width}
          onChange={event => setWidth(event.target.value)}
        />
        <input
          id="height"
          type="number"
          min="180"
          max="720"
          placeholder="height"
          value={height}
          onChange={event => setHeight(event.target.value)}
        />
        <button id="add" onClick={addYoutubeVideo}>Add YouTube video</button>
      </div>
    </div>
  )
}

export default () => {
  const editor = useEditor({
    extensions: [\
      Document,\
      Paragraph,\
      Text,\
      Youtube.configure({\
        controls: false,\
        nocookie: true,\
      }),\
    ],
    content: `
      <p>Tiptap now supports YouTube embeds! Awesome!</p>
      <div data-youtube-video>
        <iframe src="https://www.youtube.com/watch?v=3lTUAWOgoHs"></iframe>
      </div>
      <p>Try adding your own video to this editor!</p>
    `,
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
  })

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}

```

[Nodes/Youtube/React](https://embed.tiptap.dev/src/Nodes/Youtube/React/) [Edit on GitHub →](https://github.com/ueberdosis/tiptap/tree/main/demos/src/Nodes/Youtube)

## Install

```hljs bash
npm install @tiptap/extension-youtube

```

## Settings

### inline

Controls if the node should be handled inline or as a block.

Default: `false`

```hljs js
Youtube.configure({
  inline: false,
})

```

### width

Controls the default width of added videos

Default: `640`

```hljs js
Youtube.configure({
  width: 480,
})

```

### height

Controls the default height of added videos

Default: `480`

```hljs js
Youtube.configure({
  height: 320,
})

```

### controls

Enables or disables YouTube video controls

Default: `true`

```hljs js
Youtube.configure({
  controls: false,
})

```

### nocookie

Enables the nocookie mode for YouTube embeds

Default: `false`

```hljs js
Youtube.configure({
  nocookie: true,
})

```

### allowFullscreen

Allows the iframe to be played in fullscreen

Default: `true`

```hljs js
Youtube.configure({
  allowFullscreen: false,
})

```

### autoplay

Allows the iframe to start playing after the player is loaded

Default: `false`

```hljs js
Youtube.configure({
  autoplay: true,
})

```

### ccLanguage

Specifies the default language that the player will use to display closed captions. Set the parameter’s value to an ISO 639-1 two-letter language code. For example, setting it to `es` will cause the captions to be in spanish

Default: `undefined`

```hljs js
Youtube.configure({
  ccLanguage: 'es',
})

```

### ccLoadPolicy

Setting this parameter’s value to `true` causes closed captions to be shown by default, even if the user has turned captions off

Default: `false`

```hljs js
Youtube.configure({
  ccLoadPolicy: true,
})

```

### disableKBcontrols

Disables the keyboards controls for the iframe player

Default: `false`

```hljs js
Youtube.configure({
  disableKBcontrols: true,
})

```

### enableIFrameApi

Enables the player to be controlled via IFrame Player API calls

Default: `false`

```hljs js
Youtube.configure({
  enableIFrameApi: true,
})

```

### origin

This parameter provides an extra security measure for the IFrame API and is only supported for IFrame embeds. If you are using the IFrame API, which means you are setting the `enableIFrameApi` parameter value to `true`, you should always specify your domain as the `origin` parameter value.

Default: `''`

```hljs js
Youtube.configure({
  origin: 'yourdomain.com',
})

```

### endTime

This parameter specifies the time, measured in seconds from the start of the video, when the player should stop playing the video.
For example, setting it to `15` will make the video stop at the 15 seconds mark

Default: `0`

```hljs js
Youtube.configure({
  endTime: '15',
})

```

### interfaceLanguage

Sets the player’s interface language. The parameter value is an ISO 639-1 two-letter language code. For example, setting it to `fr` will cause the interface to be in french

Default: `undefined`

```hljs js
Youtube.configure({
  interfaceLanguage: 'fr',
})

```

### ivLoadPolicy

Setting this to 1 causes video annotations to be shown by default, whereas setting to 3 causes video annotations to not be shown by default

Default: `0`

```hljs js
Youtube.configure({
  ivLoadPolicy: '3',
})

```

### loop

This parameter has limited support in IFrame embeds. To loop a single video, set the loop parameter value to `true` and set the playlist parameter value to the same video ID already specified in the Player API URL.

Default: `false`

```hljs js
Youtube.configure({
  loop: true,
})

```

### playlist

This parameter specifies a comma-separated list of video IDs to play.

Default: `''`

```hljs js
Youtube.configure({
  playlist: 'VIDEO_ID_1,VIDEO_ID_2,VIDEO_ID_3,...,VIDEO_ID_N',
})

```

### modestBranding

Disables the Youtube logo on the control bar of the player. Note that a small YouTube text label will still display in the upper-right corner of a paused video when the user's mouse pointer hovers over the player

Default: `false`

```hljs js
Youtube.configure({
  modestBranding: true,
})

```

### progressBarColor

This parameter specifies the color that will be used in the player's video progress bar. Note that setting the color parameter to `white` will disable the `modestBranding` parameter

Default: `undefined`

```hljs js
Youtube.configure({
  progressBarColor: 'white',
})

```

## Commands

### setYoutubeVideo(options)

Inserts a YouTube iframe embed at the current position

```hljs js
editor.commands.setYoutubeVideo({
  src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  width: 640,
  height: 480,
})

```

#### Options

| Option | Description | Optional |
| --- | --- | --- |
| src | The url of the youtube video. Can be a YouTube or YouTube Music link |  |
| width | The embed width (overrides the default option, optional) | ✅ |
| height | The embed height (overrides the default option, optional) | ✅ |

## Source code

[packages/extension-youtube/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-youtube/)

On this page

[Introduction](https://tiptap.dev/docs/editor/extensions/nodes/youtube#page-title) [Install](https://tiptap.dev/docs/editor/extensions/nodes/youtube#install) [Settings](https://tiptap.dev/docs/editor/extensions/nodes/youtube#settings) [Commands](https://tiptap.dev/docs/editor/extensions/nodes/youtube#commands) [Source code](https://tiptap.dev/docs/editor/extensions/nodes/youtube#source-code)

![Cookiebot session tracker icon loaded](https://imgsct.cookiebot.com/1.gif?dgi=73ee9606-0ee4-41ab-85ee-7626f8741637)