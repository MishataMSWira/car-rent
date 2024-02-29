import { PrismaClient } from "@prisma/client";
import { Request, Response, response } from "express";



/** create an object of Prisma */
const prisma = new PrismaClient({ log: ["error"] });


/** create a function to "create" new event */
/** asynchronous = fungsi yg berjalan secara paralel */
const createRent = async (request: Request, response: Response) => {
  try {
    /** read a request from body */
    const carID = request.body.carID;
    const nama_penyewa = request.body.nama_penyewa;
    const tanggal = new Date(request.body.tanggal).toISOString();
    const lama_sewa = request.body.lama_sewa;


    const car = await prisma.car.findUnique({
      where : {
        carID : carID
      }
    })

    if (!car) {
      return response.status(401).json({
        status : true,
        message : "Car ID not found "
      })
    }

    /** Mengkalkulasi Total_bayar */
    const total_bayar = Number(car.harga_perhari) * lama_sewa

    /** insert to events table using prisma */
    const newData = await prisma.rent.create({
      data: {
        carID: carID,
        nama_penyewa: nama_penyewa,
        tanggal: tanggal,
        lama_sewa: lama_sewa,
        total_bayar : total_bayar
      },
    });

    return response.status(200).json({
      status: true,
      message: `Rentaler has been created`,
      data: newData,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

/** create a function to READ events */
const readRent = async (request: Request, response: Response) => {
  try {
    const dataCar = await prisma.rent.findMany();
    return response.status(200).json({
      status: true,
      message: `Rentaler has been loaded`,
      data: dataCar,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

/** function for update seats */
const updateRent = async (request: Request, response: Response) => {
  try {
    /** read seatID yg that sent from URL */
    const rentID = request.params.rentID;
    /** read data perubahan */
    const carID = request.body.carID;
    const nama_penyewa = request.body.nama_penyewa;
    const tanggal = request.body.tanggal;
    const lama_sewa = request.body.lama_sewa;

    const car = await prisma.car.findUnique({
      where : {
        carID : carID
      }
    })

    if (!car) {
      return response.status(401).json({
        status : true,
        message : "Car ID not found "
      })
    }

    /** Mengkalkulasi Total_bayar */
    const total_bayar = Number(car.harga_perhari) * lama_sewa

    /** make sure that data has exists */
    const findRent = await prisma.rent.findFirst({
      where: { rentID: Number(rentID) },
    });

    if (!findRent) {
      /** give a respon when seats not found */
      return response.status(400).json({
        status: false,
        message: `Data Rentaler not found...`,
      });
    }

    const dataRent = await prisma.rent.update({
      where: { rentID: Number(rentID) },
      data: {
        carID: carID || findRent.carID,
        nama_penyewa: nama_penyewa || findRent.nama_penyewa,
        tanggal: tanggal || findRent.tanggal,
        lama_sewa: lama_sewa || findRent.lama_sewa,
        total_bayar: total_bayar || findRent.total_bayar
      },
    });

    return response.status(200).json({
      status: true,
      message: `Rentaler has been updated`,
      data: dataRent,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

/**create a function to delete tickets */
const deleteRent = async (request: Request, response: Response) => {
  try {
    /**get event ID from URL */
    const rentID = request.params.rentID;

    /**make sure that event is exist */
    const findRent = await prisma.rent.findFirst({
      where: { rentID: Number(rentID) },
    });
    if (!findRent) {
      /** give a respon when event not found */
      return response.status(400).json({
        status: false,
        message: `Data Rentaler not found...`,
      });
    }

    /**execute for delete tickets */
    const dataRent = await prisma.rent.delete({
      where: { rentID: Number(rentID) },
    });
    return response.status(200).json({
      status: true,
      message: `Data Rentaler has been deleted`,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

export { createRent, readRent, updateRent, deleteRent };
