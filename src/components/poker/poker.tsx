import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import HistoryIcon from "@mui/icons-material/History";
import "./poker.css";

let id = 1;

interface memberInfo {
  name: string;
  money: number;
  id: number;
}

interface historyType {
  from: memberInfo;
  to: memberInfo;
  actionType: number;
  money: number;
}

const Poker = ({ members }) => {
  const [memberList, setMemberList] = useState<memberInfo[]>([]);
  const [openDialogMemberList, setOpenDialogMemberList] = useState(false);
  const [openDialogInputMoney, setOpenDialogInputMoney] = useState(false);
  const [openDialogHistory, setOpenDialogHistory] = useState(false);
  const [fromMember, setFromMember] = useState<memberInfo>();
  const [toMember, setToMember] = useState<memberInfo>();
  const [actionType, setActionType] = useState<number>();
  const [actionMoney, setActionMoney] = useState<number>();
  const [history, setHistory] = useState<historyType[]>([]);
  const [coin, setCoin] = useState(0);

  useEffect(() => {
    buildMemberList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenDialogMemberList = () => {
    setOpenDialogMemberList(true);
  };

  const handleCloseDialogMemberList = () => {
    setOpenDialogMemberList(false);
  };

  const handleOpenDialogInputMoney = () => {
    setOpenDialogInputMoney(true);
  };

  const handleCloseDialogInputMoney = () => {
    setOpenDialogInputMoney(false);
  };

  const handleOpenDialogHistory = () => {
    setOpenDialogHistory(true);
  };

  const handleCloseDialogHistory = () => {
    setOpenDialogHistory(false);
  };

  const handleAction = (actionType, from) => {
    handleOpenDialogMemberList();
    setActionType(actionType);
    setFromMember(findMember(from));
  };

  const generateId = () => {
    const result = id;
    id++;
    return result;
  };

  const handleExecuteAction = () => {
    handleCloseDialogInputMoney();
    handleCloseDialogMemberList();
    const fromMemberTemp = { ...fromMember };
    const toMemberTemp = { ...toMember };
    const result = [];
    const isToBank = toMemberTemp.id === 0;
    if (actionType === 1) {
      // tra tien
      fromMemberTemp.money += actionMoney;
      if (!isToBank) toMemberTemp.money -= actionMoney;
      else setCoin(coin - actionMoney);
    } else if (actionType === 2) {
      // muon tien
      fromMemberTemp.money -= actionMoney;
      if (!isToBank) toMemberTemp.money += actionMoney;
      else setCoin(coin + actionMoney);
    }
    memberList.forEach((m) => {
      if (m.id === fromMember.id) result.push(fromMemberTemp);
      else if (m.id === toMember.id && !isToBank) result.push(toMemberTemp);
      else result.push(m);
    });
    const historyTemp = Array.from(history);
    historyTemp.unshift({
      from: fromMember,
      to: toMember,
      actionType: actionType,
      money: actionMoney,
    });
    setHistory(historyTemp);
    setActionMoney(NaN);
    setMemberList(result);
  };

  const findMember = (id2Find) =>
    memberList.find((member) => member.id === id2Find);

  const buildMemberList = () => {
    const result = [];
    members.forEach((m) => {
      const newId = generateId().toString();
      const name = m;
      const money = 0;
      result.push({ id: newId, name, money });
    });
    setMemberList(result);
  };

  const handleToMember = (to) => {
    if (to === 0) {
      setToMember({ id: 0, name: "Ng??n h??ng", money: 0 });
    } else {
      setToMember(findMember(to));
    }
    handleOpenDialogInputMoney();
  };

  return (
    <div className="root">
      <Button onClick={handleOpenDialogHistory}>
        <HistoryIcon />
      </Button>
      {memberList.length > 0 &&
        memberList.map((m) => (
          <Card variant="outlined" key={m.id} sx={{ marginTop: "10px" }}>
            <CardContent>
              <div className="member">
                <div className="member-info">
                  <div className="member-name">{m.name}:</div>
                  <div
                    className="member-money"
                    style={{
                      color: m.money > 0 ? "green" : m.money < 0 ? "red" : "",
                    }}
                  >
                    {m.money}
                  </div>
                </div>
                <div className="member-actions">
                  <Button
                    variant="outlined"
                    color="success"
                    size="large"
                    onClick={() => handleAction(1, m.id)}
                  >
                    Tr???
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={() => handleAction(2, m.id)}
                  >
                    M?????n
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      <p>T???ng s??? x??ng ??ang ??? tr??n b??n: {coin}</p>

      <Dialog
        open={openDialogMemberList && fromMember && !openDialogInputMoney}
        onClose={handleCloseDialogMemberList}
        fullWidth
      >
        <DialogTitle>
          {fromMember?.name} mu???n {actionType === 1 ? "tr???" : "m?????n"}
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToMember(0)}>
                <ListItemText primary="Ng??n h??ng" />
              </ListItemButton>
            </ListItem>
            <Divider />
            {memberList.map((m) => {
              if (m.id !== fromMember?.id)
                return (
                  <div key={m.id}>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleToMember(m.id)}>
                        <ListItemText primary={m.name} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </div>
                );
              else return null;
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogMemberList}>Hu???</Button>
        </DialogActions>
      </Dialog>

      {/* to member */}

      <Dialog
        open={openDialogInputMoney && !!toMember}
        onClose={handleCloseDialogInputMoney}
        fullWidth
      >
        <DialogTitle>
          {fromMember?.name} mu???n {actionType === 1 ? "tr???" : "m?????n"}{" "}
          {toMember?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Bao nhi??u ti???n"
            type="number"
            variant="standard"
            value={actionMoney}
            onChange={(event) => {
              setActionMoney(parseInt(event.target.value));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogInputMoney}>Hu???</Button>
          <Button
            onClick={handleExecuteAction}
            disabled={actionMoney > 0 ? false : true}
          >
            Xong
          </Button>
        </DialogActions>
      </Dialog>
      {/* history */}

      <Dialog
        open={openDialogHistory}
        onClose={handleCloseDialogHistory}
        fullWidth
      >
        <DialogTitle>L???ch s???</DialogTitle>
        <DialogContent>
          <List>
            {history?.map((h) => (
              <>
                <ListItem>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <p>
                          {h.from.name} {h.actionType === 1 ? "tr???" : "m?????n"}{" "}
                          {h.to.id === 0 ? "ng??n h??ng" : h.to.name}: {h.money}
                        </p>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogHistory}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Poker;
