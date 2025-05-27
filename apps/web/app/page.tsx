import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from '@/components/Image';
import { cn } from '@mjs/ui/lib/utils';
import { Button } from '@mjs/ui/primitives/button';

export default function Home() {
  return (
    <div className='flex flex-col w-full items-center fancy-overlay'>
      {/* <LandingSocialProofBand invert={false} className='hidden md:flex'>
        <LandingSocialProofBandItem>
          Fast, reliable, and secure
        </LandingSocialProofBandItem>

        <LandingSocialProofBandItem>
          Easy to use, easy to love
        </LandingSocialProofBandItem>

        <LandingSocialProofBandItem graphic='rating'>
          99% customer satisfaction
        </LandingSocialProofBandItem>
      </LandingSocialProofBand> */}

      <div
        className={cn(
          'grid grid-rows-[auto_repeat(1fr)]',
          `[&>section]:min-h-[100dvh] [&>section]:h-full`,
          'w-full'
        )}
      >
        <Header className='mb-0 lg:mb-0 mx-auto' />
        <section id='home' className='relative bg-transparent!'>
          <div className='mx-auto z-1 h-full grid place-items-center'>
            <div
              id={'hero-characters'}
              className='grid grid-cols-6 grid-rows-3'
            >
              <div className='flex flex-col gap-4 col-start-2 col-end-6 row-start-2 row-end-4 z-10'>
                <h1 className='font-head lg:text-7xl text-center'>
                  <span className='block'>Join the Web3</span>
                  <span className='block'>Mahjong Game</span>
                </h1>
                <h2 className='text-xl text-center font-common font-medium'>
                  Challenge your friends at Mahjong Stars where <br /> Where
                  cool characters rule the game!
                </h2>
                <Button className='w-full max-w-md mx-auto uppercase font-bold animate-pulse'>
                  PLAY NOW
                </Button>
              </div>
              <Image
                src='/static/images/chars1.webp'
                alt='hero-characters'
                fill
                className='w-full h-full object-cover z-1 col-start-1 col-end-7 row-start-1 row-end-4 -mt-20 animate-fade-in-down-slow 2xl:scale-75'
              />
            </div>
          </div>
          <Image
            src='/static/images/bg.webp'
            alt='bg'
            className='w-full h-full absolute inset-0'
            priority
            fill
            sizes='100vw'
            style={{
              objectFit: 'cover',
              zIndex: -1,
            }}
          />
        </section>
        <section className='min-h-screen min-w-screen grid place-items-center relative'>
          <div className='size-[300px] bg-amber-300'>HOLAAA</div>
          <Image
            src='/static/images/chars1.webp'
            alt='hero-characters'
            fill
            className='w-full h-full object-cover z-1 col-start-1 col-end-7 row-start-1 row-end-4 -mt-20 animate-fade-in-down-slow 2xl:scale-75'
          />
        </section>
        {/* <section>C</section>
        <section>D</section> */}
        {/* 
        <LandingPrimaryImageCtaSection
          title='$MJS Token – Powering the Mahjong Stars Ecosystem'
          description='$MJS is the core utility token of Mahjong Stars, enabling NFT trading, AI upgrades, tournament access, and revenue staking. Participate in a multi-billion dollar Web3 opportunity and fuel the first global social mahjong platform with real-world value and AI liquidity.'
          imageSrc='/static/images/product-sample.webp'
          withBackground
          withBackgroundGlow
          // leadingComponent={<LandingProductHuntAward />}
        >
          <Button size='xl' asChild>
            <Link href='/join'>Get Started</Link>
          </Button>

          <Button size='xl' asChild variant='outlinePrimary'>
            <Link href='/read-more'>Know more</Link>
          </Button>

          <LandingDiscount
            discountValueText='30% off'
            discountDescriptionText='for the first 10 customers (2 left)'
          />

          <LandingSocialProof
            className='w-full mt-12'
            showRating
            numberOfUsers={99}
            suffixText='happy users'
            avatarItems={[
              {
                imageSrc: 'https://picsum.photos/id/64/100/100',
                name: 'John Doe',
              },
              {
                imageSrc: 'https://picsum.photos/id/65/100/100',
                name: 'Jane Doe',
              },
              {
                imageSrc: 'https://picsum.photos/id/669/100/100',
                name: 'Alice Doe',
              },
            ]}
          />
        </LandingPrimaryImageCtaSection> */}

        {/* 
      <LandingProductFeature
        title='Comprehensive Eco-system'
        descriptionComponent={
          <>
            <LandingProductFeatureKeyPoints
              keyPoints={[
                {
                  title: 'Intuitive Interface',
                  description:
                    'Design and customize your app easily with our simple drag-and-drop interface.',
                },
                {
                  title: 'Seamless Integration',
                  description:
                    'Connect your app with other tools effortlessly for a smoother workflow.',
                },
                {
                  title: 'Smart Analytics',
                  description:
                    'Gain valuable insights into user behavior and trends with our advanced analytics tools.',
                },
              ]}
            />

            <Button asChild>
              <Link href='/join'>Get Started</Link>
            </Button>

            <p className='text-sm'>
              7 day free trial, no credit card required.
            </p>
          </>
        }
        imageSrc='/static/images/backdrop-19.webp'
        imageAlt='Screenshot of the product'
        imagePosition='left'
        imagePerspective='none'
      /> */}

        {/* <LandingProductFeature
        title='Seamless NFT Trading'
        descriptionComponent={
          <>
            <p>
              Trade unique Mahjong-themed NFTs with ease, showcasing your
              achievements and creativity while participating in a vibrant
              community where every piece has significance and value.
            </p>

            <LandingProductFeatureKeyPoints
              keyPoints={[
                {
                  title: 'Rock-Solid Security',
                  description:
                    'Rest assured, your data is safe with our top-notch security measures.',
                },
                {
                  title: 'Automatic Updates',
                  description:
                    'Never miss out on the latest features - our app updates itself automatically!',
                },
                {
                  title: 'Scalability on Demand',
                  description:
                    'Grow your app along with your business needs, effortlessly expanding to meet demand.',
                },
              ]}
            />

            <Button asChild variant='outlinePrimary'>
              <Link href='/read-more'>Know more</Link>
            </Button>

            <p className='text-sm'>Get started with our free tier.</p>
          </>
        }
        imageSrc='/static/images/backdrop-20.webp'
        imageAlt='Screenshot of the product'
        imagePosition='right'
        imagePerspective='none'
        withBackground
        withBackgroundGlow
        variant='secondary'
        backgroundGlowVariant='secondary'
      /> */}
        {/* <LandingProductFeature
          title='AI Upgrades Integration'
          descriptionComponent={
            <>
              <p>
                Utilize advanced AI algorithms to enhance your gameplay tactics
                based on real-time data analysis, ensuring you stay competitive
                and informed in every match.
              </p>

              <Button asChild variant='outlinePrimary'>
                <Link href='/read-more'>Know more</Link>
              </Button>

              <p className='text-sm'>First month is on us.</p>
            </>
          }
          imageSrc='/static/images/backdrop-5.webp'
          imageAlt='Screenshot of the product'
          imagePosition='left'
          imagePerspective='none'
          variant='secondary'
        /> */}

        {/* <LandingBandSection
          className='min-h-[100dvh] h-full'
          title='4.9/5 stars'
          description='Our customers love our product.'
          supportingComponent={
            <LandingSocialProof
              showRating
              numberOfUsers={99}
              avatarItems={[
                {
                  imageSrc: 'https://picsum.photos/id/64/100/100',
                  name: 'John Doe',
                },
                {
                  imageSrc: 'https://picsum.photos/id/65/100/100',
                  name: 'Jane Doe',
                },
                {
                  imageSrc: 'https://picsum.photos/id/669/100/100',
                  name: 'Alice Doe',
                },
              ]}
            />
          }
        /> */}

        {/* <LandingProductFeature
          title='Join the Game'
          descriptionComponent={
            <>
              Experience a new era of Mahjong with real-world value and AI
              integration.
              <Button asChild variant='outlinePrimary'>
                <Link href='/read-more'>Know more</Link>
              </Button>
            </>
          }
          withBackground
          variant='secondary'
          imageSrc='/static/images/product-sample.webp'
          imageAlt='Screenshot of the product'
          imagePosition='center'
          textPosition='center'
        /> */}
        {/* 
        <LandingSaleCtaSection
          title='Invest in Your Passion'
          description="By acquiring $MJS Tokens, you're not just eliminating barriers in Mahjong Gaming—you're investing in a billion-dollar ecosystem poised for growth while enjoying the benefits of staking and tournaments."
          ctaHref={'#'}
          ctaLabel={'Pre-order now'}
          withBackgroundGlow
        /> */}

        {/* <LandingTestimonialReadMoreWrapper size='md'>
          <LandingTestimonialGrid
            title='Hear It from Our Users'
            description='Discover what our happy customers have to say about their experience with our AI app:'
            testimonialItems={[
              {
                name: 'John Smith',
                text: 'This app transformed our operations, boosting productivity like never before. Highly customizable and incredibly efficient!',
                handle: '@john_smith',
                imageSrc: 'https://picsum.photos/id/64/100/100',
              },
              {
                name: 'Emily Johnson',
                text: "Even with minimal tech knowledge, I could create my own app from scratch. It's empowering to have full control!",
                handle: '@emily_johnson',
                imageSrc: 'https://picsum.photos/id/65/100/100',
              },
              {
                name: 'David Rodriguez',
                text: 'Thanks to the analytics tools, we identified bottlenecks and saved significantly on costs. Truly impressive!',
                handle: '@david_rodriguez',
                imageSrc: 'https://picsum.photos/id/669/100/100',
                featured: true,
              },
              {
                name: 'Mandy',
                text: 'Excellent product!',
                handle: '@mandy',
                imageSrc: 'https://picsum.photos/id/829/100/100',
              },
              {
                name: 'Alex',
                text: 'Can easily recommend!',
                handle: '@alex',
                imageSrc: 'https://picsum.photos/100/100.webp?random=2',
              },
              {
                name: 'Sam',
                text: 'I am very happy with the results.',
                handle: '@sam',
                imageSrc: 'https://picsum.photos/100/100.webp?random=3',
              },
            ]}
            withBackgroundGlow
            withBackground
          />
        </LandingTestimonialReadMoreWrapper> */}

        {/* <LandingFeatureList
          title='Awesome Features Await!'
          description='Explore the fantastic features of our AI app:'
          featureItems={[
            {
              title: 'Intuitive Interface',
              description:
                'Design and customize your app easily with our simple drag-and-drop interface.',
              icon: <LayersIcon />,
            },
            {
              title: 'Seamless Integration',
              description:
                'Connect your app with other tools effortlessly for a smoother workflow.',
              icon: <LineChartIcon />,
            },
            {
              title: 'Smart Analytics',
              description:
                'Gain valuable insights into user behavior and trends with our advanced analytics tools.',
              icon: <SparklesIcon />,
            },
            {
              title: 'Rock-Solid Security',
              description:
                'Rest assured, your data is safe with our top-notch security measures.',
              icon: <LightbulbIcon />,
            },
            {
              title: 'Automatic Updates',
              description:
                'Never miss out on the latest features - our app updates itself automatically!',
              icon: <ZapIcon />,
            },
            {
              title: 'Scalability on Demand',
              description:
                'Grow your app along with your business needs, effortlessly expanding to meet demand.',
              icon: <ThumbsUpIcon />,
            },
            {
              title: 'Intelligent Assistance',
              description:
                'Receive personalized recommendations and insights tailored to your workflow, helping you make informed decisions and work more efficiently.',
              icon: <ChromeIcon />,
            },
            {
              title: 'Seamless Collaboration',
              description:
                'Easily collaborate with team members and clients in real-time, fostering productivity and enhancing communication across projects.',
              icon: <FigmaIcon />,
            },
            {
              title: 'Advanced Customization',
              description:
                'Tailor your app to fit your unique requirements with extensive customization options, ensuring it aligns perfectly with your business objectives.',
              icon: <FramerIcon />,
            },
          ]}
        /> */}
        {/* 
        <LandingFaqCollapsibleSection
          title='Frequently Asked Questions about $MJS Token'
          description='Explore the benefits and opportunities offered by the $MJS token within the Mahjong Stars ecosystem.'
          faqItems={[
            {
              question: 'What is the $MJS token?',
              answer:
                '$MJS is the core utility token that fuels the Mahjong Stars platform, enabling users to trade NFTs, participate in tournaments, and benefit from AI enhancements.',
            },
            {
              question: 'How can I use $MJS tokens?',
              answer:
                '$MJS tokens can be utilized for NFT trading, gaining access to exclusive tournaments, staking for revenue, and upgrading your gaming experience with AI features.',
            },
            {
              question:
                'What benefits does participating in the Mahjong Stars ecosystem offer?',
              answer:
                'By participating with $MJS tokens, you engage in a global community, enjoy real-world value, and tap into a burgeoning multi-billion dollar Web3 opportunity.',
            },
          ]}
          withBackground
        /> */}
      </div>
      {/* <section className="container-wide mt-12 p-4">
				<LatestArticles />
			</section> */}

      {/* <div className='w-full flex flex-col items-center gap-8 md:gap-16'>
        <section className='container-ultrawide'>
          <ComponentDemo />
        </section>
      </div> */}

      <Footer />
    </div>
  );
}
