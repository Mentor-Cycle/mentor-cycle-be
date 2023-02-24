import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from '@common/services/crypt';
import { AuthInvalidError, ObjectAlreadyExistsError } from '@common/errors';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { SignInUserDto } from './dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let cryptService: CryptService;
  let user: any;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            getByEmail: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: CryptService,
          useValue: {
            compare: jest.fn(),
            encrypt: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
    cryptService = moduleRef.get<CryptService>(CryptService);
    user = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'Abc123!@#',
      photoUrl: 'https://example.com/johndoe.jpg',
      skills: ['JavaScript', 'React', 'Node.js'],
      birthDate: new Date('1990-01-01'),
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://example.com',
      description: 'Lorem ipsum dolor sit amet',
      isMentor: true,
      facebookId: 'johndoe',
      googleId: 'johndoe@gmail.com',
      status: 'active',
      isVerified: true,
      linkedinId: 'johndoe',
      isTermsAccepted: true,
      onBoardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      availability: [],
      eventId: '1',
    };
  });

  describe('signIn', () => {
    const input: SignInUserDto = {
      email: 'user@example.com',
      password: 'password',
    };

    it('should throw AuthInvalidError when no user is found with the given email', async () => {
      // Arrange
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(null);

      // Act
      const signInPromise = userService.signIn(input);

      // Assert
      await expect(signInPromise).rejects.toThrow(AuthInvalidError);
      expect(userRepository.getByEmail).toHaveBeenCalledWith(input.email);
    });

    it('should throw AuthInvalidError when the password is incorrect', async () => {
      // Arrange
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(user);
      jest.spyOn(cryptService, 'compare').mockResolvedValueOnce(false);

      // Act
      const signInPromise = userService.signIn(input);

      // Assert
      await expect(signInPromise).rejects.toThrow(AuthInvalidError);
      expect(userRepository.getByEmail).toHaveBeenCalledWith(input.email);
      expect(cryptService.compare).toHaveBeenCalledWith(
        input.password,
        user.password,
      );
    });
    it('should generate a token and return the user object when the email and password are correct', async () => {
      // Arrange
      const email = 'johndoe@example.com';
      const password = 'password123';

      const signInUserDto: SignInUserDto = { email, password };

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(cryptService, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      // Act
      const result = await userService.signIn(signInUserDto);

      // Assert
      expect(result).toEqual({ token: 'token', user });
      expect(userRepository.getByEmail).toHaveBeenCalledWith(email);
      expect(cryptService.compare).toHaveBeenCalledWith(
        password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: user.id, email, role: 'USER' },
        { subject: user.id, secret: process.env.SECRET },
      );
    });
  });
  describe('signUpUser', () => {
    it('should throw ObjectAlreadyExistsError when a user with the same email already exists', async () => {
      const args = user;
      jest.spyOn(userRepository, 'count').mockResolvedValue(1);
      await expect(userService.signUpUser(args)).rejects.toThrow(
        ObjectAlreadyExistsError,
      );
    });

    it("should create a new user and generate a token when the user with the given email doesn't already exist", async () => {
      const args = user;
      jest.spyOn(userRepository, 'count').mockResolvedValue(0);
      jest.spyOn(userRepository, 'create').mockResolvedValue(args);
      jest.spyOn(jwtService, 'sign').mockReturnValue('dummyToken');
      const result = await userService.signUpUser(args);
      expect(userRepository.count).toHaveBeenCalledTimes(1);
      expect(userRepository.count).toHaveBeenCalledWith({ email: args.email });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(args);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: '1', email: args.email, role: 'USER' },
        { subject: '1', secret: process.env.SECRET },
      );
      expect(result.user).toEqual(args);
      expect(result.token).toEqual('dummyToken');
    });
  });
});
