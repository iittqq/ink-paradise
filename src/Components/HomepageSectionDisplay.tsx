import MangaClickable from "./MangaClickable";
import { Grid } from "@mui/material";

type Props = {
  mangaData: any;
  section: any;
};

const HomepageSectionDisplay = (props: Props) => {
  const { mangaData } = props;

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "580px",
          overflow: "clip",
        }}
      >
        {mangaData.map((element: any) => (
          <Grid item>
            <MangaClickable
              id={element["id"]}
              title={element["attributes"]["title"]["en"]}
              coverId={
                element["relationships"].find(
                  (i: any) => i.type === "cover_art"
                ).id
              }
              updatedAt={element["attributes"].updatedAt}
              homePage={true}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomepageSectionDisplay;

/*<MangaClickable
  id={element["mal_id"]}
  title={element["title"]}
  coverUrl={element["images"]["jpg"]["image_url"]}
  rank={element["rank"]}
  homePage={true}
  author={element["authors"][0]["name"]}
/>;
*/
