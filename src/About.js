import React from "react"
import Page from "./Page/Page"

const About = () => {
  const page = "About"

  return (
    <Page>
      {/* edit below */}

      <h1>{page}</h1>

      <p>
        This is the About. Edit me in
        <a
          href={`https://github.com/basilleaf/luti/blob/master/src/${page}.js`}
        >
          src/{page}.js
        </a>
      </p>

      <p>
        <em>Life Under the Ice</em> is an exploratory tour through the microscopic world of Antarctica. Each microbe tells a story of the weird and whimsical life in Antarctica that is otherwise invisible to the naked eye.
      </p>

      <p>
        Typically when we think about Antarctica, we think of a place that's barren and lifeless... except for a few penguins. But Antarctica should instead be known as a polar oasis of life, host to countless creatures that are utterly fascinating. We just can’t usually see them – until now. <em>Life Under the Ice</em> enables anyone to delve into this world as an explorer; as if you had been shrunk down and were wading through one large petri dish of curiosities.
      </p>
    </Page>
  )
}

export default About
