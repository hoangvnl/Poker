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
import "./poker.css";

let id = 1;

interface memberInfo {
  name: string;
  money: number;
  id: number;
}

const Poker = ({ members }) => {
  const [memberList, setMemberList] = useState<memberInfo[]>([]);
  const [openDialogMemberList, setOpenDialogMemberList] = useState(false);
  const [openDialogInputMoney, setOpenDialogInputMoney] = useState(false);
  const [fromMember, setFromMember] = useState<memberInfo>();
  const [toMember, setToMember] = useState<memberInfo>();
  const [actionType, setActionType] = useState<number>();
  const [actionMoney, setActionMoney] = useState<number>();
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
    } else if (actionType === 2) {
      // muon tien
      fromMemberTemp.money -= actionMoney;
      if (!isToBank) toMemberTemp.money += actionMoney;
    }
    memberList.forEach((m) => {
      if (m.id === fromMember.id) result.push(fromMemberTemp);
      else if (m.id === toMember.id && !isToBank) result.push(toMemberTemp);
      else result.push(m);
    });
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
      setToMember({ id: 0, name: "Ngân hàng", money: 0 });
    } else {
      setToMember(findMember(to));
    }
    handleOpenDialogInputMoney();
  };

  return (
    <div className="root">
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
                    Trả
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={() => handleAction(2, m.id)}
                  >
                    Mượn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      <Dialog
        open={openDialogMemberList && fromMember && !openDialogInputMoney}
        onClose={handleCloseDialogMemberList}
        fullWidth
      >
        <DialogTitle>
          {fromMember?.name} muốn {actionType === 1 ? "trả" : "mượn"}
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToMember(0)}>
                <ListItemText primary="Ngân hàng" />
              </ListItemButton>
            </ListItem>
            <Divider />
            {memberList.map((m) => {
              if (m.id !== fromMember?.id)
                return (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleToMember(m.id)}>
                        <ListItemText primary={m.name} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </>
                );
              else return null;
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogMemberList}>Huy</Button>
        </DialogActions>
      </Dialog>

      {/* to member */}

      <Dialog
        open={openDialogInputMoney && !!toMember}
        onClose={handleCloseDialogInputMoney}
        fullWidth
      >
        <DialogTitle>
          {fromMember?.name} muốn {actionType === 1 ? "trả" : "mượn"}{" "}
          {toMember?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Bao nhiêu tiền"
            type="number"
            variant="standard"
            value={actionMoney}
            onChange={(event) => {
              setActionMoney(parseInt(event.target.value));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogInputMoney}>Huỷ</Button>
          <Button
            onClick={handleExecuteAction}
            disabled={actionMoney > 0 ? false : true}
          >
            Xong
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Poker;
