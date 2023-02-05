require 'open-uri'

# These URLs/name pairs were scraped manually from Youtube.

icons = [
  ['https://yt3.ggpht.com/OhBw01gTLTGAuk2zRq9ls48AO1jcMQA_bIW8CdF-hROGXtKi7CYLU4EUI68JpztTX0mvNg=w48-h48-c-k-nd', 'hand-pink-waving'],
  ['https://yt3.ggpht.com/Fw4rdTlWPq8YomP8WS9dY4nObuU5r8bqTNiKCtw7cjS_T6ULryiihu-fTkqRuDNNiC6kWC0=w48-h48-c-k-nd', 'face-blue-smiling'],
  ['https://yt3.ggpht.com/LfXGKUk1-6jnvn431RSc53VS1S3oXbYzy9h4ANkd9V6do4QJ7I77B-FHarhefk3gCK-a6g=w48-h48-c-k-nd', 'face-red-droopy-eyes'],
  ['https://yt3.ggpht.com/FinjQDXgPOsKAw8fKMYDEZXk5doCAbav1AVqQjqfBvj2N1nAEWWoIXY9awFLaW6M_ExZqzU=w48-h48-c-k-nd', 'face-purple-crying'],
  ['https://yt3.ggpht.com/MJAydyIqpYaA5RmXzjN_dmleyyvhWBmBktt-Ukwm6c6RJ6nRWyBKniSbidB8mGxu0OOe9w=w48-h48-c-k-nd', 'text-green-game-over'],
  ['https://yt3.ggpht.com/dkrlGTxSSPpJWdV2DNUYHUlgcdoA2wJ2Bb53_awGBCu5gNXDmtayiZgy187zPbNJGCfOxA=w48-h48-c-k-nd', 'person-turqouise-waving'],
  ['https://yt3.ggpht.com/rR08F1tOQp2hJpgLgJw5cOaUZ7kvTKUKwi52qWcdUqm98HmBEX-dt17rNwlnzSLn_OVRWQ=w48-h48-c-k-nd', 'face-green-smiling'],
  ['https://yt3.ggpht.com/bVyaHHOG8OQ6I-h_dpcoXdoxwyt3_jbsl0sY6fy-3Q1U9QC4oijSHE5yntraUL8jTAS_EEi9=w48-h48-c-k-nd', 'face-orange-frowning'],
  ['https://yt3.ggpht.com/gz8vmCf6xoVU0AxBd24vAEOtdiU2T8mg_nO89iHNLc6q5L1J5_qqNU8oUnpMwh1q2WpnNpfV=w48-h48-c-k-nd', 'eyes-purple-crying'],
  ['https://yt3.ggpht.com/96mGr7WMz083oARAXImdw3q0dT98g2AIoGy0fiUWRnfXewOSqkWn5IbWsPpi40r4trrlJg=w48-h48-c-k-nd', 'face-fuchsia-wide-eyes'],
  ['https://yt3.ggpht.com/BTqH4Z52OJtAGzXMQZMPvsHMO0THBuy1-b9X2ud8MJsN1IzDn3sPpfKbbykHeSJjvF22Hw=w48-h48-c-k-nd', 'cat-orange-whistling'],
  ['https://yt3.ggpht.com/rP-R--BiOz-fXHrs5c4v3GEhHjainbj6k3SH1U7lbBYrpXeG9OCy5rvVbpAXjSbsUMhFCfw=w48-h48-c-k-nd', 'face-blue-wide-eyes'],
  ['https://yt3.ggpht.com/6Gs6hPM3EL3legtFNYYW_OgUjszukF0YIQ8irPh92q2tVWtRqcm4BJBSjimxjygO9UISt28=w48-h48-c-k-nd', 'face-orange-raised-eyebrow'],
  ['https://yt3.ggpht.com/HdJlL3PV_BO0kR3NHfPvpUNWR7K2V1eH1RszzHuJnd2mOdJ5sDB8rlYlVyLQnAV4QVKleQ=w48-h48-c-k-nd', 'face-fuchsia-tongue-out'],
  ['https://yt3.ggpht.com/kJGqoJEV9pTafzqYHk8RstZmwFrpo7CzhvkpP5SCdHi4a4EJTEBqlblKyMzrJCoFhhLuIp4=w48-h48-c-k-nd', 'face-orange-biting-nails'],
  ['https://yt3.ggpht.com/jlGaND0xiCG3PXSCQLyDrrIwP0DFSvsE9NIdP6G3OFA88FvpFwQCDGcGWb282Gsw5smGiNo=w48-h48-c-k-nd', 'face-red-heart-shape'],
  ['https://yt3.ggpht.com/ruRWPwngdxK8BA95KPFFBycJ7SBQMhMJYd8NRFQF8qV2GL1mDE0yK4Q6niDeXlxh0JFSBCk=w48-h48-c-k-nd', 'face-fuchsia-poop-shape'],
  ['https://yt3.ggpht.com/zpsw0-3dpYPJWXDk6c7eCfx7ng9KSSUKAiNwK-0l-Kw-JkBXUA9S0S-pMb709IYT-KaxD5M=w48-h48-c-k-nd', 'face-purple-wide-eyes'],
  ['https://yt3.ggpht.com/P_Wh6EAU3Sz3ECrqQ7YfvkRnbsWWsRoH3oKGaaUtBhCX5xBYRu1AyzIq8jucp16TNh4DoA=w48-h48-c-k-nd', 'glasses-purple-yellow-diamond'],
  ['https://yt3.ggpht.com/WaJ1EqpAhY9XDIUI89X27Iwqtu0RSMjsw7VSJQWSOLiJK6q0gKQE37qyWzYb1nQXgAl9eis=w48-h48-c-k-nd', 'face-pink-tears'],
  ['https://yt3.ggpht.com/R1yL02GQIkXrQFI_2mTqcmbWJvHaW6JvSZKpcmRUpqH4zOPcJe7E61C-fe7mwHcHUbrMzG8=w48-h48-c-k-nd', 'body-blue-raised-arms'],
  ['https://yt3.ggpht.com/-xjHfRIjxWfrGKzDo7oVRvKXCYxxMixHyBZW97K2WokdfMi768lRUrXxyauWQnLAUpwJVw=w48-h48-c-k-nd', 'hand-orange-covering-eyes'],
  ['https://yt3.ggpht.com/bw_ckgdpZAOpvAvYk4rAUsrpJC3PpX9bRGGG5j49IMZ2BVUNI7G1pOhS61NwoH5R51KlXKE=w48-h48-c-k-nd', 'trophy-yellow-smiling'],
  ['https://yt3.ggpht.com/2oMNN2TNHGFTmp5m0jFojHSMokWiowQKXSF_o09wlPEuk8wwoPM-N5YF8_1sD0bUIbztb3A=w48-h48-c-k-nd', 'eyes-pink-heart-shape'],
  ['https://yt3.ggpht.com/fnFnLCrxTUe8JyxAWgDwbfyHcOHt5JDsWEE2E8De_8DQDSAPipTb4-z-f4Gl1olesfarWac=w48-h48-c-k-nd', 'face-turquoise-covering-eyes'],
  ['https://yt3.ggpht.com/hdhO2QoyicGlLinZ_ovC9wMN6SRqwSTIzYtLtXBGyrgGxaXdtv3J4DIY9tEwUhEr6icb9fQ=w48-h48-c-k-nd', 'hand-green-crystal-ball'],
  ['https://yt3.ggpht.com/3Yn2nA0ZmHtYd-AbaIUGQi4d0TqGRA2CrkR1afsrEIBbw7Q5nMJI1hKYh0o2rc6XO3IYvMA=w48-h48-c-k-nd', 'face-turquoise-drinking-coffee'],
  ['https://yt3.ggpht.com/095gtQRZvlFjwYT9aR-xBNGaj-cqCX9rbGD9ckbJscZRT7h7h4fmn0GoJI5FLFZLrm5n_w=w48-h48-c-k-nd', 'body-green-covering-eyes'],
  ['https://yt3.ggpht.com/F7YqKEoNPgkEapAj2nXBe_gv6giLggKH0lBeSPZ_-r960UFTjQabVeI2LWVuCJkGyBaBhnRB=w48-h48-c-k-nd', 'goat-turquoise-white-horns'],
  ['https://yt3.ggpht.com/bKGpkUuAE48hlZq2_fEQZh2r_4C0phHHJnLZpcu0KQUIwYeulCUkK5FzC3EK5AMM4zi97rw=w48-h48-c-k-nd', 'hand-purple-blue-peace'],
  ['https://yt3.ggpht.com/ufgLUMbZSdsw49NVW83jge5dOa5m0dS_eihw8oBD_bSQgQiz3XqzKCTGSsRUpeFPEoRDZ9A=w48-h48-c-k-nd', 'face-blue-question-mark'],
  ['https://yt3.ggpht.com/hWnHU6AL1MvnPhbXTilKNUbiccxr3fBVSStdydN71KVgFc7w7mIyAakB0y08le5aN1TYmv6a=w48-h48-c-k-nd', 'face-blue-covering-eyes'],
  ['https://yt3.ggpht.com/_66ObJa8uVE6dah8J7B7dplBvEPjKPfrjwSgV069NJSa0VwgscAKD8Qe4-xqWzGRihfT2nt7=w48-h48-c-k-nd', 'face-purple-smiling-fangs'],
  ['https://yt3.ggpht.com/B5eomJ4J3-PGWfhCpCGDAIeeqgjNFG4Ip1bZEx8BlQWw8S9XRbqfzlz5CoBsz_B1cgGd3w=w48-h48-c-k-nd', 'face-purple-sweating'],
  ['https://yt3.ggpht.com/PugKIiwQxTQY3-zu5pZ-R5fhz9P0qNeXoRhd6F_nvadwZZO6xIGNkRyB_aQmY3qcsn8dX74=w48-h48-c-k-nd', 'face-purple-smiling-tears'],
  ['https://yt3.ggpht.com/09uVbyI_tiCWhYkbSXQSh6CMxqK-LaAvJv-bD9vN7h122w8uPgRwrsJDBZifodSbtaz8td0=w48-h48-c-k-nd', 'face-blue-star-eyes'],
  ['https://yt3.ggpht.com/bInnjwWcSAQNruUXoIOKiPdJ1rUpGABWj_FBi0OF3LaT349wKRTpqcSJCyHyEvu1YDT4uv8=w48-h48-c-k-nd', 'face-blue-heart-eyes'],
  ['https://yt3.ggpht.com/1qb1pjkoT7FLtOkWqF68eAzraIGhmGRA0P9Cvgt7NkSxZHDAr1NgYI-0oupu-pQ07MsBCjw=w48-h48-c-k-nd', 'face-blue-three-eyes'],
  ['https://yt3.ggpht.com/j6G00m7-nQyNxsQzEtvrIQ3EZ2pan9XcJYRMie0a41-KcFnIRUakfyI9hxoebgS2adiV5og=w48-h48-c-k-nd', 'face-blue-droopy-eyes'],
  ['https://yt3.ggpht.com/QarSso3_lyo0FqBsyqntUh3UmkigE_dqf-mXpZGsL4zma7kdlpXoTqgfTjcrFGu0Q4QxyzU=w48-h48-c-k-nd', 'planet-orange-purple-ring'],
  ['https://yt3.ggpht.com/m6yqTzfmHlsoKKEZRSZCkqf6cGSeHtStY4rIeeXLAk4N9GY_yw3dizdZoxTrjLhlY4r_rkz3GA=w48-h48-c-k-nd', 'yt'],
  ['https://yt3.ggpht.com/qByNS7xmuQXsb_5hxW2ggxwQZRN8-biWVnnKuL5FK1zudxIeim48zRVPk6DRq_HgaeKltHhm=w48-h48-c-k-nd', 'oops'],
  ['https://yt3.ggpht.com/foWgzjN0ggMAA0CzDPfPZGyuGwv_7D7Nf6FGLAiomW5RRXj0Fs2lDqs2U6L52Z4J2Zb-D5tCUAA=w48-h48-c-k-nd', 'buffering'],
  ['https://yt3.ggpht.com/u3QDxda8o4jrk_b01YtJYKb57l8Zw8ks8mCwGkiZ5hC5cQP_iszbsggxIWquZhuLRBzl5IEM2w=w48-h48-c-k-nd', 'stayhome'],
  ['https://yt3.ggpht.com/ktU04FFgK_a6yaXCS1US-ReFkLjD22XllcIMOyBRHuYKLsrxpVxsauV1gSC2RPraMJWXpWcY=w48-h48-c-k-nd', 'dothefive'],
  ['https://yt3.ggpht.com/gt39CIfizoIAce9a8IzjfrADV5CjTbSyFKUlLMXzYILxJRjwAgYQQJ9PXXxnRvrnTec7ZpfHN4k=w48-h48-c-k-nd', 'elbowbump'],
  ['https://yt3.ggpht.com/6LPOiCw9bYr3ZXe8AhUoIMpDe_0BglC4mBmi-uC4kLDqDIuPu4J3ErgV0lEhgzXiBluq-I8j=w48-h48-c-k-nd', 'goodvibes'],
  ['https://yt3.ggpht.com/Av7Vf8FxIp0_dQg4cJrPcGmmL7v9RXraOXMp0ZBDN693ewoMTHbbS7D7V3GXpbtZPSNcRLHTQw=w48-h48-c-k-nd', 'thanksdoc'],
  ['https://yt3.ggpht.com/bP-4yir3xZBWh-NKO4eGJJglr8m4dRnHrAKAXikaOJ0E5YFNkJ6IyAz3YhHMyukQ1kJNgQAo=w48-h48-c-k-nd', 'videocall'],
  ['https://yt3.ggpht.com/-o0Di2mE5oaqf_lb_RI3igd0fptmldMWF9kyQpqKWkdAd7M4cT5ZKzDwlmSSXdcBp3zVLJ41yg=w48-h48-c-k-nd', 'virtualhug'],
  ['https://yt3.ggpht.com/WxLUGtJzyLd4dcGaWnmcQnw9lTu9BW3_pEuCp6kcM2pxF5p5J28PvcYIXWh6uCm78LxGJVGn9g=w48-h48-c-k-nd', 'yougotthis'],
  ['https://yt3.ggpht.com/4PaPj_5jR1lkidYakZ4EkxVqNr0Eqp4g0xvlYt_gZqjTtVeyHBszqf57nB9s6uLh7d2QtEhEWEc=w48-h48-c-k-nd', 'sanitizer'],
  ['https://yt3.ggpht.com/ehUiXdRyvel0hba-BopQoDWTvM9ogZcMPaaAeR6IA9wkocdG21aFVN_IylxRGHtl2mE6L9jg1Do=w48-h48-c-k-nd', 'takeout'],
  ['https://yt3.ggpht.com/Plqt3RM7NBy-R_eA90cIjzMEzo8guwE0KqJ9QBeCkPEWO7FvUqKU_Vq03Lmv9XxMrG6A3Ouwpg=w48-h48-c-k-nd', 'hydrate'],
  ['https://yt3.ggpht.com/ZN5h05TnuFQmbzgGvIfk3bgrV-_Wp8bAbecOqw92s2isI6GLHbYjTyZjcqf0rKQ5t4jBtlumzw=w48-h48-c-k-nd', 'chillwcat'],
  ['https://yt3.ggpht.com/jiaOCnfLX0rqed1sISxULaO7T-ktq2GEPizX9snaxvMLxQOMmWXMmAVGyIbYeFS2IvrMpxvFcQ=w48-h48-c-k-nd', 'chillwdog'],
  ['https://yt3.ggpht.com/kWObU3wBMdHS43q6-ib2KJ-iC5tWqe7QcEITaNApbXEZfrik9E57_ve_BEPHO86z4Xrv8ikMdW0=w48-h48-c-k-nd', 'elbowcough'],
  ['https://yt3.ggpht.com/LiS1vw8KUXmczimKGfA-toRYXOcV1o-9aGSNRF0dGLk15Da2KTAsU-DXkIao-S7-kCkSnJwt=w48-h48-c-k-nd', 'learning'],
  ['https://yt3.ggpht.com/66Fn-0wiOmLDkoKk4FSa9vD0yymtWEulbbQK2x-kTBswQ2auer_2ftvmrJGyMMoqEGNjJtipBA=w48-h48-c-k-nd', 'washhands'],
  ['https://yt3.ggpht.com/0WD780vTqUcS0pFq423D8WRuA_T8NKdTbRztChITI9jgOqOxD2r6dthbu86P6fIggDR6omAPfnQ=w48-h48-c-k-nd', 'socialdist'],
  ['https://yt3.ggpht.com/KgaktgJ3tmEFB-gMtjUcuHd6UKq50b-S3PbHEOSUbJG7UddPoJSmrIzysXA77jJp5oRNLWG84Q=w48-h48-c-k-nd', 'shelterin']
]

DIR = 'src/assets/images/youtube-icons'.freeze

puts "Downloading to #{DIR}"

`mkdir #{DIR}`

icons.each do |(url, name)|
  puts "Downloading icon :#{name}: from URL #{url}"

  IO.copy_stream(URI.open(url), "#{DIR}/#{name}.png")
end

# Print all as JS array.
all = icons.map { |(_url, name)| "'#{name}'" }.join(', ')
puts "[#{all}]"
