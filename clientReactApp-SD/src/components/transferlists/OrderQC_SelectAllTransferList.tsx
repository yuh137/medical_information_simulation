import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import QCOrderButtons from "./Buttons/QCOrderButtons";
import axios from "axios";

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)];
}

export default function OrderQC_SelectAllTransferList() {
  const [panelNames, setPanelNames] = React.useState<string[]>([]);
  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [left, setLeft] = React.useState<readonly number[]>([]);
  const [right, setRight] = React.useState<readonly number[]>([]);
  React.useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchBackendData = async () => {
      // panelNamesFromBackend = [];
      const responseQCLots = await axios.get(
        "http://localhost:5029/api/AdminQCLots",
      );
      const dataQCLots = responseQCLots.data;
      const dataQCLotsLength = dataQCLots.length;
      console.log("QC Lots", dataQCLots);

      // Gets the names of the QCLots in the database
      const fetchedPanelNames = dataQCLots.map((lot: any) => lot.qcName);
      setPanelNames(fetchedPanelNames);
      setLeft(fetchedPanelNames.map((_: string, index: number) => index));
    };
    fetchBackendData();
  }, []);

  // const [checked, setChecked] = React.useState<readonly number[]>([]);
  // const [left, setLeft] = React.useState<readonly number[]>(
  //   panelNamesFromBackend.map((_, index) => index),
  // );
  // const [right, setRight] = React.useState<readonly number[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly number[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleClearSelection = () => {
    setLeft(left.concat(right));
    setRight([]);
    setChecked([]);
  };

  const handleOrderQC = () => {
    const selectedPanelNames = right.map((index) => panelNames[index]); // Maps indices to panel names
    localStorage.setItem(
      "selectedQualityControls",
      JSON.stringify(selectedPanelNames),
    );
    window.location.href = "/submitQCOrder";
  };

  const customList = (title: React.ReactNode, items: readonly number[]) => (
    <Card sx={{ width: 400, height: 500 }}>
      {" "}
      {/* Increased the width and height */}
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: "100%", // Use full width of the card
          height: "calc(100% - 72px)", // Adjust height based on CardHeader and Divider
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: number) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={panelNames[value]} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <Grid item>{customList("Quality Control Panels", left)}</Grid>
        <Grid item>
          <Grid container direction="column" sx={{ alignItems: "center" }}>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList("Selected Quality Controls", right)}</Grid>
      </Grid>
      <Grid container direction="column" sx={{ alignItems: "center" }}>
        <QCOrderButtons
          onClearSelection={handleClearSelection}
          onOrderQC={handleOrderQC}
        />
      </Grid>
    </>
  );
}
