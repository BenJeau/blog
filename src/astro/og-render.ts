import { siteTitle } from "../content";

export const render = (
  title: string,
  description: string,
  readingTime?: string,
  image?: string,
) => ({
  type: "div",
  props: {
    style: {
      height: "100%",
      width: "100%",
      position: "relative",
      color: "white",
      fontFamily: "Open Sans",
      display: "flex",
    },
    children: [
      image && {
        type: "img",
        props: {
          src: image,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            objectFit: "cover",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            backgroundColor: "black",
            opacity: image ? 0.8 : 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            padding: 55,
            gap: 55,
            justifyContent: "space-between",
          },
          children: [
            {
              type: "div",
              props: {
                style: { display: "flex", gap: 32, alignItems: "center" },
                children: [
                  {
                    type: "svg",
                    props: {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "96",
                      height: "96",
                      viewBox: "0 0 256 256",
                      fill: "none",
                      children: [
                        {
                          type: "rect",
                          props: {
                            width: "256",
                            height: "256",
                            fill: "white",
                          },
                        },
                        {
                          type: "path",
                          props: {
                            d: "M83 119H101V92H83V119ZM101 128H83V164H101V128ZM56 164H65V92H56V83H110V92H119V119H110V128H119V164H110V173H56V164ZM164 83H200V92H191V164H182V173H146V164H137V137H155V164H173V92H164V83Z",
                            fill: "black",
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: 0,
                      },
                      children: [
                        {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 32,
                              fontFamily: "Open Sans Bold",
                              margin: 0,
                            },
                            children: siteTitle,
                          },
                        },
                        {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 32,
                              fontFamily: "Open Sans",
                              margin: 0,
                            },
                            children: readingTime,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: { display: "flex", flexDirection: "column", gap: 8 },
                children: [
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: 72,
                        fontFamily: "Open Sans Bold",
                        lineHeight: 1.2,
                      },
                      children: title,
                    },
                  },
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: 32,
                        fontFamily: "Open Sans",
                      },
                      children: description,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
});
