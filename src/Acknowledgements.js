import React from "react";
import { Helmet } from "react-helmet";
import Page from "./Page/Page";

const Acknowledgements = () => {
  const page = "Acknowledgements";

  return (
    <Page>
      {/* edit below */}

      <Helmet>
        <meta name="twitter:title" content={`Life Under The Ice - ${page}`} />
        <meta property="og:title" content={`Life Under The Ice - ${page}`} />
        <meta
          name="twitter:description"
          content="The process of formulating, creating and executing Life Under the Ice was six years in the making."
        />
        <meta
          property="og:description"
          content="The process of formulating, creating and executing Life Under the Ice was six years in the making."
        />
        <meta
          name="twitter:image"
          content="https://lifeundertheice.org/TwitterCard_Tardigrade.jpg"
        />
        <meta
          property="og:image"
          content="https://lifeundertheice.org/TwitterCard_Tardigrade.jpg"
        />
      </Helmet>

      <h1>{page}</h1>

      <p>
        <em>
          The process of formulating, creating and executing Life Under the Ice
          was six years in the making. The expedition and project would not have
          been possible without the support of so many awesome people and
          organizations along the way. I have attempted to list them all below
          both because they are deserving of so much gratitude, but also to be
          transparent in detailing just how much “it takes a village” for
          someone to accomplish their dreams.
        </em>
        <br />– <a href="https://arielwaldman.com">Ariel Waldman</a>, creator of{" "}
        <em>Life Under the Ice</em>
      </p>
      <br />
      <p>
        <strong>Enormous thanks to…</strong>
      </p>

      <p>
        <strong>
          <a href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=503518">
            National Science Foundation Antarctic Artists & Writers program
          </a>
        </strong>
        <br />
        for being an invaluable program and resource in service to artists,
        scientists and society at-large. The program covered the cost of
        international flights, as well as logistics, food, and housing while in
        Antarctica. Specifically, thank you to Mike Lucibella and Elaine Hood
        for welcoming me to such a special place and taking on the lion’s share
        of all the months of logistics it took to create a successful expedition
        (including helping me physically lug many pounds of camera and
        microscope equipment around). Thank you also to Valentine Kass and Peter
        West for managing such an incredible program and providing valuable
        feedback and guidance over the years.
      </p>

      <p>
        <strong>
          <a href="https://lisaballard.dev/">Lisa Ballard</a>
        </strong>
        <br />
        for being the lead web developer for Life Under the Ice, turning a vague
        concept into a technical reality and open sourcing it along the way.
        Also for being there for me as an awesome BFF throughout the ups and
        downs of this effort.
      </p>

      <p>
        <strong>
          <a href="https://twitter.com/mattb">Matt Biddulph</a>
        </strong>
        <br />
        for being the deputy web developer for <em>Life Under the Ice</em> and
        navigating the challenges of video on the web. Thanks also for being the
        best partner, cheerleader, and collaborator throughout.
      </p>

      <p>
        <strong>National Geographic</strong>
        <br />
        for supporting unaffiliated, independent explorers such as myself.
        National Geographic’s{" "}
        <a href="https://www.nationalgeographic.org/funding-opportunities/grants/what-we-fund/">
          exploration grant
        </a>{" "}
        allowed me to acquire a robust field-microscope setup, hire a web
        developer to help make this project come to fruition, and provided a
        modest stipend for the first couple months of my post-expedition
        microscopy work.
      </p>

      <p>
        <strong>
          All my patrons on{" "}
          <a href="https://patreon.com/arielwaldman">Patreon</a>
        </strong>
        <br />
        for being awesome humans and supporting my otherwise-unfunded work and
        lab equipment{" "}
        <a href="https://www.patreon.com/posts/heavy-sigh-and-11497109">
          over the years
        </a>
        . This included time spent: researching, developing and writing
        proposals, meeting with artists and scientists to solicit support,
        teaching myself microscopy, taking one year of classes and lab time at
        school to become certified in microscopy, figuring out permits, figuring
        out equipment needs, five months of working closely with NSF on
        logistics and preparing everything for my expedition, the five weeks I
        spent in Antarctica, production of a{" "}
        <a href="https://www.youtube.com/playlist?list=PLN_whQB72CoDyLvgy12QpPszBA808YxMW">
          five episode mini-series
        </a>{" "}
        about the expedition, and all the development that went into the
        creation of this website once I got back home.
      </p>

      <p>
        <strong>
          <a href="https://en.wikipedia.org/wiki/Christopher_McKay">
            Chris McKay
          </a>
        </strong>
        <br />
        for being my champion and guide throughout. There is so much unwritten
        knowledge about the logistics and politics of Antarctic work that I
        would’ve likely never known about and struggled to navigate without his
        shared wisdom. Chris helped me brainstorm the project its nascent days,
        gave me my first microscope, helped identify peer-reviewed papers
        relevant to my project, encouraged me to conduct my own
        portfolio-building field work, provided feedback on my proposals, and
        was a co-author for my first academic conference poster. He also helped
        kickstart my growing interest in astrobiology.
      </p>

      <p>
        <strong>
          <a href="https://micro.utk.edu/faculty/mikucki.php">Jill Mikucki</a>
        </strong>
        <br />
        for defending the merit of this project over the years, fighting for me
        to get what I needed for a successful expedition, and taking me under
        her wing while simultaneously showing me how to take charge in
        Antarctica. I’ll forever have fond memories of the week I spent camping
        at Lake Bonney, the site of Blood Falls and her{" "}
        <a href="http://astrobiology.com/2014/03/exploring-below-antarcticas-blood-falls.html">
          prime stomping ground
        </a>
        .
      </p>

      <p>
        <strong>
          <a href="https://www.sfmicrosoc.org/">
            San Francisco Microscopical Society
          </a>
        </strong>
        <br />
        for providing a friendly, local community to welcome me when I was just
        a self-taught beginner in microscopy looking for help. A small grant
        from SFMS allowed me to purchase the primary microscope much of the
        microbes on this site are seen through (a Nikon E200-LED). Thanks
        specifically to Peter Werner for recommending I enroll in school to
        receive my certification in microscopy and teaching me so much, and Cody
        Prebys-Williams and Henry Schott for so much encouragement and support.
      </p>

      <p>
        <strong>Merritt College</strong>
        <br />
        and specifically Gisele Giorgi for creating an inclusive microscopy
        program that welcomes students who want to use microscopes for science,
        art, or just a better paycheck. The{" "}
        <a href="https://www.merritt.edu/wp/microscopy/">
          Merritt Microscopy Program
        </a>{" "}
        certified me in optical microscopy, but more importantly gave me the
        confidence I needed to be a self-reliant microscopist in the field in
        Antarctica. Thanks also to Candy Mintz for giving me the confidence I
        need to run my own lab space.
      </p>

      <p>
        <strong>
          <a href="http://schmidt.eas.gatech.edu/project-rise-up/">
            Britney Schmidt & the Icefin team
          </a>
        </strong>
        <br />
        for your support, time, helpful advice, and welcoming me to ride along
        with your awesome robot.
      </p>

      <p>
        <strong>
          <a href="https://pacificasommers.com/">Pacifica Sommers</a>,{" "}
          <a href="https://entnemdept.ifas.ufl.edu/people-directory/dorota-porazinska/">
            Dorota Porazinska
          </a>
          , and Adam Solon
        </strong>
        <br />
        for helping me conquer hiking up my first glacier! I couldn’t have done
        it without their expertise, assistance, and patience. They literally
        helped me tie my shoes (crampons) at one point. All in service of
        exploring the many awesome microbes that live inside glaciers via{" "}
        <a href="https://cryoholes.wordpress.com/">cryoconite holes</a>. Thanks
        also to Dorota for giving me awesome pointers on how to filter microbes
        in the field.
      </p>

      <p>
        <strong>
          <a href="https://antarcticsun.usap.gov/features/4191/">Rob Robbins</a>
          , Steve Rupp, and{" "}
          <a href="http://www.henrykaiserguitar.com/">Henry Kaiser</a>
        </strong>
        <br />
        for diving into the cold depths of Antarctic waters to fetch me the
        coolest of microbes. Also thanks for being so welcoming, helping me
        navigate McMurdo, and making sure I was included.
      </p>

      <p>
        <strong>
          <a href="http://kenmankoff.com">Ken Mankoff</a>
        </strong>
        <br />
        for being the first to tell me about the existence of the Antarctic
        Artists and Writers program, encouraging me to apply, and putting me in
        touch with Jill Mikucki. This journey would not have even begun without
        him suggesting it to me.
      </p>

      <p>
        <strong>
          <a href="https://nai.nasa.gov/directory/boston-penelope/">
            Penny Boston
          </a>
        </strong>
        <br />
        for including me in the astrobiology world, sending opportunities my
        way, helping review my proposals, and providing tons of helpful advice
        and guidance over the years.
      </p>

      <p>
        <strong>
          <a href="http://www.montana.edu/priscu/">John Priscu</a>
        </strong>
        <br />
        for providing a letter of support to someone new to the Antarctic field,
        and for trying to get me out into the “deep field” of Antarctica, which
        I still hope to find an opportunity to.
      </p>

      <p>
        <strong>
          <a href="https://www.nasa.gov/content/lynn-j-rothschild">
            Lynn Rothschild
          </a>
        </strong>
        <br />
        for offering a letter of support and being a champion of
        multidisciplinary collaboration.
      </p>

      <p>
        <strong>
          <a href="https://www.siena.edu/faculty-and-staff/person/matt-bellis/">
            Matt Bellis
          </a>
        </strong>
        <br />
        for taking the time to review my proposals, provide valuable
        suggestions, and for always offering help when I need it.
      </p>

      <p>
        <strong>
          <a href="https://twitter.com/Alex_Parker">Alex Parker</a>
        </strong>
        <br />
        for helping review my proposals, making valuable introductions, and
        providing excellent advice on how to convey my concept.
      </p>

      <p>
        <strong>
          <a href="https://adamslab.byu.edu/">Byron Adams</a>
        </strong>
        <br />
        for helping me get my lab supplies in order, tracking down answers, and
        providing additional microbes for filming. Thanks also for all the
        support and encouragement to collaborate in future expeditions.
      </p>

      <p>
        <strong>
          <a href="http://www.maryannarogers.com/">Maryanna Rogers</a>
        </strong>
        <br />
        for the letter of support and helping workshop my proposal to stay
        rooted in art.
      </p>

      <p>
        <strong>
          <a href="https://twitter.com/ianbrunswick">Ian Brunswick</a> and{" "}
          <a href="https://twitter.com/shaunoboyle">Shaun O’Boyle</a>
        </strong>
        <br />
        for letters of support and being a welcoming interface to the awesome{" "}
        <a href="https://dublin.sciencegallery.com/">Science Gallery</a>{" "}
        network.
      </p>

      <p>
        <strong>
          <a href="http://www.ganucheau.com/">Matt Ganucheau</a>
        </strong>
        <br />
        for the letter of support and encouragement from the world of art+tech.
      </p>

      <p>
        <strong>
          <a href="https://www.seti.org/our-scientists/seth-shostak">
            Seth Shostak
          </a>
        </strong>
        <br />
        for the letter of support early on, being a sounding board, and for
        always believing in me.
      </p>

      <p>
        <strong>
          <a href="http://www.iftf.org/marinagorbis/">Marina Gorbis</a>
        </strong>
        <br />
        for the encouragement, cheerleading, and letter of support early on.
      </p>

      <p>
        <strong>
          <a href="https://sloan.org/about/staff/joshua-m-greenberg">
            Josh Greenberg
          </a>
        </strong>
        <br />
        for the encouragement and letter of support early on in this effort.
      </p>

      <p>
        <strong>Brad Bebout and Angela Detweiler</strong>
        <br />
        for helping me build my portfolio in the lead up to this project by
        letting me come take photos of the{" "}
        <a href="https://spacescience.arc.nasa.gov/microecobiogeo/">
          awesome microbial mats
        </a>{" "}
        you grow at NASA Ames.
      </p>

      <p>
        <strong>
          <a href="http://djspooky.com/">Paul Miller</a>
        </strong>
        <br />
        for keeping me motivated and helping me think about alternative pathways
        to Antarctica if this one didn’t pan out.
      </p>

      <p>
        <strong>
          <a href="https://www.linkedin.com/in/mills42/">Caroline Miller</a>
        </strong>
        <br />
        for giving me a tour of an awesome microscope startup and offering space
        for me to experiment with microscopes early on in my microscopy journey.
        And thanks to Stef Magdalinski for introducing me to Caroline.
      </p>

      <p>
        <strong>Friends, family, and colleagues</strong>
        <br />
        for rooting for me over the years since I started pursuing this dream in
        earnest in 2013. I’m grateful for all your support.
      </p>

      <p>
        <strong>All the wonderful people I met while in Antarctica</strong>
        <br />
        for helping me with really huge tasks and also just in small ways, and
        for being so friendly and making me feel welcome. There’s so many of
        you. 60 to be exact. Thanks (and thank you again) to Peter Abraham, Nels
        Abrams, Denis Barkats, Kimberly Beachy, Anne Beaulaurier, Marci Beitch,
        Linda Best, Yubecca Bragg, Frances Bryson, David Burris, Amy Chiuchiolo,
        Andrew Christensen, Christine Colburn, Jessie Crain, Richard Dean, Peter
        Doran, Megan Goodale, Chad Goodale, Michael Gooseff, Hailey Gruber,
        Tiegan Hobbs, Elaine Hood, Henry Kaiser, Cole Kelleher, Robert Kendall,
        Mitch Kennedy, Doug Kowalewski, Michelle LaRue, Jennifer Law, Justin
        Lawrence, Mike Lucibella, Timothy Lynch, Ellie Mango, Matt Meister, Jill
        Mikucki, Andy Mullen, Mark Murphy, Krista Myers, Madeline Myers, Susan
        Nachtigal, Dorota Porazinska, Jennifer Rhemann, Rob Robbins, David
        Robinson, T.J. Rogers, Steve Rupp, Caitlin Scarano, Neal Scheibe,
        Britney Schmidt, Adam Solon, Pacifica Sommers, Michael Stone, James
        VanMatre, Claire Veligdan, Joe Wallis, Kathleen Welch, David White,
        Spring Wood, Debora Zamd, and Steve Zellerhoff.
      </p>
    </Page>
  );
};

export default Acknowledgements;
