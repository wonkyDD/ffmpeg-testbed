- https://github.com/mifi/lossless-cut/issues/126
- https://github.com/mifi/lossless-cut/issues/372#issuecomment-761844667
- https://github.com/mifi/lossless-cut/blob/master/src/smartcut.js
- https://github.com/anyc/avcut


- https://stackoverflow.com/questions/14005110/how-to-split-a-video-using-ffmpeg-so-that-each-chunk-starts-with-a-key-frame

- https://github.com/mifi/lossless-cut/blob/master/src/smartcut.js


# TODO

"ffmpeg cut and merge smooth?"

- avcut이란?
- smartcut의 구현?
- segment muxer? (https://stackoverflow.com/questions/44580808/how-to-use-ffmpeg-to-split-a-video-and-then-merge-it-smoothly)
- https://github.com/transitive-bullshit/ffmpeg-concat

```
step = 2, count = 10일 때
segments[3] 자체가 그냥 { frames: [] } 이다.
```


## 생각

- 첫번째 pkt_pts_time을 원래 start에 추가해주고 다시 cut을 하면 될 것 같다.
    - end는 건들일 필요가 없다고 생각함


## 읽어봐야하는 것들

- https://trac.ffmpeg.org/wiki
- https://trac.ffmpeg.org/wiki/Concatenate
- https://ffmpeg.org/ffmpeg.html#Stream-copy
