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
        Sensors indicate human life forms 30 meters below the planet's surface.
        Stellar flares are increasing in magnitude and frequency. Set course for
        Rhomboid Dronegar 006, warp seven. There's no evidence of an advanced
        communication network. Total guidance system failure, with less than 24
        hours' reserve power. Shield effectiveness has been reduced 12 percent.
        We have covered the area in a spherical pattern which a ship without
        warp drive could cross in the given time.
      </p>

      <p>
        Run a manual sweep of anomalous airborne or electromagnetic readings.
        Radiation levels in our atmosphere have increased by 3,000 percent.
        Electromagnetic and subspace wave fronts approaching synchronization.
        What is the strength of the ship's deflector shields at maximum output?
        The wormhole's size and short period would make this a local phenomenon.
        Do you have sufficient data to compile a holographic simulation?
      </p>
    </Page>
  )
}

export default About
