"use client";
import { useEffect, useState, useRef } from "react";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemRefs = useRef([]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    const inventoryList = [];
    querySnapshot.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(db, "inventory", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: docSnap.data().quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    fetchData();
  };

  const removeItem = async (item) => {
    const docRef = doc(db, "inventory", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: docSnap.data().quantity - 1 });
      }
    }

    fetchData();
  };

  const handleSearch = () => {
    if (typeof window !== "undefined") {
      const itemIndex = inventory.findIndex((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (itemIndex !== -1 && itemRefs.current[itemIndex]) {
        itemRefs.current[itemIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      {/*  */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(50%,50%)"
          width={400}
          border="2px solid #000"
          boxShadow={24}
          bgcolor={"white"}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%,-50%)" }}
        >
          <Typography>Add Item</Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              addItem(itemName);
              setItemName("");
              handleClose();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      {/*  */}
      <Typography variant="h2">Inventory Tracker</Typography>
      <Box width="20%" display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Search Item"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Box width="50%">
        <TableContainer component={Paper} elevation={2} sx={{ maxHeight: 300 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 200, overflow: "auto" }}>
              {inventory.map((item, index) => (
                <TableRow
                  key={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Box>{item.quantity}</Box>
                    <RemoveCircleIcon
                      sx={{ color: "#ff0000" }}
                      onClick={() => {
                        removeItem(item.name);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" onClick={handleOpen} sx={{ marginTop: 2 }}>
          Add Item
        </Button>
      </Box>
    </Box>
  );
}
