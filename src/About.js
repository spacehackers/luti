import React from "react";
import Page from "./Page/Page";

const About = () => {
  const page = "About the Project";

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
        Typically when we think about Antarctica, we think of a place that's barren and lifeless... except for a few penguins. But Antarctica should instead be known as a polar oasis of life, host to countless creatures that are utterly fascinating. They’ve just been invisible to us – until now. <em>Life Under the Ice</em> enables anyone to delve into the microscopic world of Antarctica as an explorer; as if you had been shrunk down and were wading through one large petri dish of curiosities.
      </p>

      <p>
      All microscopy videos from the project are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0) and available at <a href="https://lifeundertheice.org/videos">lifeundertheice.org/videos</a>. <em>Life Under the Ice</em> will continue to be updated with new videos of Antarctic microbes every several months as new samples are made available and processed. You can directly support this project by <a href="https://patreon.com/arielwaldman">becoming a patron</a>.
      </p>

      <p>
      <strong>THE EXPEDITION</strong>
      </p>

      <p>
      <a href="https://arielwaldman.com">Ariel Waldman</a> led a 5-week expedition to Antarctica as a wildlife filmmaker at the microbial scale. She brought microscopes into the field to film and investigate the microscopic extremophiles that live under the ice so that we can have a more complete picture of our home planet.
      </p>

      <p>
      The collected Antarctic microbes were found living within glaciers, under the sea ice, next to frozen lakes, and in subglacial ponds. Microbes from under the sea ice were discovered in the Southern Ocean’s McMurdo Sound near McMurdo Station and the Erebus Glacier Tongue. Microbes from glaciers and frozen lakes were discovered in the McMurdo Dry Valleys at Lake Bonney and Lake Hoare.
      </p>

      <p>
      <img src="/USGS_McMurdoSound_Cropped_Highlighted.png" />
      <br />
      <small><em>Map courtesy of USGS. Yellow circles highlight locations sampled.</em></small>
      </p>

      <p>
      While in Antarctica, Ariel filmed her expedition and showcased the locations, fieldwork, people, and processes of what it was like to capture life under the ice. From how to get to Antarctica to diving beneath the sea ice, the five-episode mini-series below reveals the experience of being in Antarctica in a way you likely haven't seen before.
      </p>

      <p>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/VJZIgFO-dFg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <br />
      <small><em>Ariel spent 5 weeks in Antarctica to film microbes living under the ice. Here's how she got there.</em></small>
      </p>

      <p>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/u9aHl-qssHI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <br />
      <small><em>Ariel joined Antarctic divers in going deep under the sea ice to explore the weird wonders of the Southern Ocean.</em></small>
      </p>

      <p>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/d7TMawjKG5k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <br />
      <small><em>Here's what it was like to camp outside in the Antarctic Dry Valleys next to the natural phenomenon known as Blood Falls.</em></small>
      </p>

      <p>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/hImxHVhlan4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <br />
      <small><em>Some of the extremophiles Ariel sought to film with her microscopes live embedded INSIDE glaciers. Ariel climbed on to the top of a glacier in search for tardigrades and shared what it was like to camp at Lake Hoare next to Canada Glacier.</em></small>
      </p>

      <p>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/PcZxLJ9RbLM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <br />
      <small><em>While in Antarctica, Ariel went on a day-long road trip across the sea ice with a team that uses a robot called Icefin to explore the seafloor. One day, robots like Icefin may help us explore the icy moons in our solar system, such as Europa.</em></small>
      </p>

      <br />
      <p>
      If you would like to get in touch regarding this project, email <a href="mailto:ariel@arielwaldman.com">ariel@arielwaldman.com</a>.
      </p>
      <br />
      <p>
      ---
      <br />
      <small><em>Disclosure: This material is based upon work supported by the National Science Foundation under Grant Number 1745408. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author and do not necessarily reflect the views of the National Science Foundation.</em></small>
      </p>
    </Page>
  );
};

export default About;
