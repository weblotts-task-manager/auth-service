import { BadRequestError, ConflictError } from "../errors/appError";
import { ILocation, Location } from "../models/location.model";
import { Profile } from "../models/profile.model";

export const createUserLocation = async (
  locationData: Partial<ILocation>
): Promise<ILocation> => {
  const { profile } = locationData;
  const userProfile = await Profile.findById({ _id: profile });
  const foundLocation = await Location.find({ profile: profile });
  if (foundLocation) {
    throw new ConflictError("Location already recoded");
  }
  if (userProfile) {
    const location = (await Location.create(locationData)) as ILocation;
    if (userProfile) {
      userProfile.location = location._id as any;
      userProfile.save();
    }
    return location;
  }
  throw new BadRequestError("Unable to add location -");
};
