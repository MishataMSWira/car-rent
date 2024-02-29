import { PrismaClient } from "@prisma/client";
import { Request, Response, response } from "express";

/** create an object of Prisma */
const prisma = new PrismaClient({log:["error"]});


/** create a function to "create" new event */
/** asynchronous = fungsi yg berjalan secara paralel */
const createCar = async (request: Request, response: Response) => {
  try {
    /** read a request from body */
    const nopol = request.body.nopol
    const merkModel = request.body.merkModel
    const harga_perhari = Number(request.body.harga_perhari)

    /** insert to events table using prisma */
    const newData = await prisma.car.create({
      data: {
        nopol : nopol,
        merkModel : merkModel,
        harga_perhari : harga_perhari 
      },
    });

    return response.status(200).json({
      status: true,
      message: `Cars has been created`,
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
const readCar = async (request: Request, response: Response) => {
  try {
    const page = Number(request.query.page) || 1;
    const qty = Number(request.query.qty) || 10;
    const keyword = request.query.keyword?.toString() || "";
    const dataCar = await prisma.car.findMany({
      take: qty, // mendefinisikan jml data yg diambil
      skip: (page -1) * qty,
      where: {
        OR: [
          {nopol: {contains: keyword}},
          {merkModel: {contains: keyword}},
        ]
      },
      orderBy: {nopol: "asc"}
    });
    return response.status(200).json({
      status: true,
      message: `Cars has been loaded`,
      data: dataCar,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

/** function for update event */
const updateCar = async (request: Request, response: Response) => {
  try {
    /** read eventID yg that sent from URL */
    const carID = request.params.carID;
    /** read data perubahan */
    const nopol = request.body.nopol
    const merkModel = request.body.merkModel
    const harga_perhari = request.body.harga_perhari

    /** make sure that data has exists */
    const findCar = await prisma.car.findFirst({
      where: { carID: Number(carID) },
    });

    if (!findCar) {
      /** give a respon when event not found */
      return response.status(400).json({
        status: false,
        message: `Data car not found...`,
      });
    }

    const dataCar = await prisma.car.update({
      where: { carID: Number(carID) },
      data: {
        nopol : nopol || findCar.nopol,
        merkModel : merkModel || findCar.merkModel,
        harga_perhari : harga_perhari || findCar.harga_perhari
      },
    });

    return response.status(200).json({
      status: true,
      message: `Car has been updated`,
      data: dataCar,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

/**create a function to delete event */
const deleteCar = async (request: Request, response: Response) => {
  try {
    /**get event ID from URL */
    const carID = request.params.carID

    /**make sure that event is exist */
    const findCar = await prisma.car.findFirst({
      where: { carID: Number(carID)}
    })
    if (!findCar) {
      /** give a respon when event not found */
      return response.status(400).json({
        status: false,
        message: `Data car not found...`,
      });
    }

    /**execute for delete event */
    const dataCar = await prisma.car.delete({
      where : {carID: Number(carID)}
    })
    return response.status(200)
    .json({
      status: true,
      message: `Data car has been deleted`
    })

  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

export { createCar, readCar, updateCar, deleteCar };
