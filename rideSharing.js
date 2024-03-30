class RideSharingApp {
  constructor() {
    this.user = {};
    this.vehicles = {};
    this.offeredRides = {};
    this.onGoingRides = {};
  }

  add_user(userDetails) {
    const [name, gender, age] = userDetails.split(", ");
    this.user[name] = { gender, age, taken: 0, offerred: 0 };
  }

  add_vehicle(vehicleDetails) {
    const [name, vehicle, registration] = vehicleDetails.split(", ");
    if (name in this.vehicles) {
      this.vehicles[name].push({ vehicle, registration });
    } else {
      this.vehicles[name] = [{ vehicle, registration }];
    }
  }

  offer_ride(rideDetails) {
    const [name, origin, seats, vehicle, registration, destination] =
      rideDetails.split(", ");
    const rideId = `${name}-${registration}`;
    if (!(name in this.offeredRides)) {
      this.offeredRides[name] = [];
    } else {
      if (
        this.offeredRides[name].some(
          (ride) => ride.registration === registration
        )
      ) {
        console.log(
          "Ride offering failed: A ride has already been offered by this user for this vehicle"
        );
        return;
      }
    }
    this.offeredRides[name].push({
      id: rideId,
      origin,
      seats: Number(seats),
      vehicle,
      registration,
      destination,
    });
    this.user[name].offerred++;
  }

  search_ride(rideDetails) {
    const [name, origin, destination, seats, preference] =
      rideDetails.split(", ");
    let rides = [];
    for (const offeredUser in this.offeredRides) {
      this.offeredRides[offeredUser].forEach((ride) => {
        if (
          ride.origin === origin &&
          ride.destination === destination &&
          ride.seats >= seats
        ) {
          rides.push({ user: offeredUser, ride_id: ride.id, ride });
        }
      });
    }
    if (preference === "Most Vacant") {
      rides.sort((a, b) => b.ride.seats - a.ride.seats);
    } else {
      const preferredVehicle = preference.split("=")[1];
      const result = rides.filter((ride) => {
        return ride.ride.vehicle.toString() === preferredVehicle.toString();
      });
      rides = result;
    }
    if (rides.length > 0) {
      console.log(rides);
    } else {
      console.log("No Rides Found");
    }
  }

  select_ride(name, ride_id) {
    const offeredUser = ride_id.split("-")[0];
    const selectedRideDetails = this.offeredRides[offeredUser].find(
      (ride) => ride.id === ride_id
    );
    this.user[name].taken++;
    this.onGoingRides[ride_id] = {
      origin: selectedRideDetails.origin,
      destination: selectedRideDetails.destination,
      registration: selectedRideDetails.registration,
    };
    this.offeredRides[offeredUser] = this.offeredRides[offeredUser].filter(
      (ride) => ride.id !== ride_id
    );
  }

  end_ride(ride_id) {
    delete this.onGoingRides[ride_id];
  }

  printRideStats() {
    for (const user in this.user) {
      console.log(
        `${user}: ${this.user[user].taken} Taken, ${this.user[user].offerred} Offered`
      );
    }
  }
}

const rideSharingApp = new RideSharingApp();

// Add User
rideSharingApp.add_user("Rohan, M, 36");
rideSharingApp.add_user("Shashank, M, 29");
rideSharingApp.add_user("Nandini, F, 29");
rideSharingApp.add_user("Shipra, F, 27");
rideSharingApp.add_user("Gaurav, M, 29");
rideSharingApp.add_user("Rahul, M, 35");

// Add Vehicle
rideSharingApp.add_vehicle("Rohan, Swift, KA-01-12345");
rideSharingApp.add_vehicle("Shashank, Baleno, TS-05-62395");
rideSharingApp.add_vehicle("Shipra, Polo, KA-05-41491");
rideSharingApp.add_vehicle("Shipra, Activa, KA-12-12332");
rideSharingApp.add_vehicle("Rahul, XUV, KA-05-1234");

// Offer Ride
rideSharingApp.offer_ride("Rohan, Hyderabad, 1, Swift, KA-01-12345, Bangalore");
rideSharingApp.offer_ride("Shipra, Bangalore, 1, Activa, KA-12-12332, Mysore");
rideSharingApp.offer_ride("Shipra, Bangalore, 2, Polo, KA-05-41491, Mysore");
rideSharingApp.offer_ride(
  "Shashank, Hyderabad, 2, Baleno, TS-05-62395, Bangalore"
);
rideSharingApp.offer_ride("Rahul, Hyderabad, 5, XUV, KA-05-1234, Bangalore");
rideSharingApp.offer_ride("Rohan, Bangalore, 1, Swift, KA-01-12345, Pune");

// Search Ride
rideSharingApp.search_ride("Nandini, Bangalore, Mysore, 1, Most Vacant");
rideSharingApp.search_ride(
  "Gaurav, Bangalore, Mysore, 1, Preferred Vehicle=Activa"
);
rideSharingApp.search_ride("Shashank, Mumbai, Bangalore, 1, Most Vacant");
rideSharingApp.search_ride(
  "Rohan, Hyderabad, Bangalore, 1, Preferred Vehicle=Baleno"
);
rideSharingApp.search_ride(
  "Shashank, Hyderabad, Bangalore, 1, Preferred Vehicle=Polo"
);

// select_ride
rideSharingApp.select_ride("Nandini", "Shipra-KA-05-41491");
rideSharingApp.select_ride("Gaurav", "Shipra-KA-12-12332");
rideSharingApp.select_ride("Rohan", "Shashank-TS-05-62395");

// End Ride
rideSharingApp.end_ride("Shipra-KA-05-41491");
rideSharingApp.end_ride("Shipra-KA-12-12332");
rideSharingApp.end_ride("Shashank-TS-05-62395");

// Print Stat
rideSharingApp.printRideStats();
